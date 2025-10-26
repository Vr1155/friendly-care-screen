import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Mic, Square, Volume2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AudioRecorder } from "@/utils/AudioRecorder";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI MedGuard assistant. I'm here to help with health questions, symptom information, and wellness advice. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    audioRecorderRef.current = new AudioRecorder();
    audioRef.current = new Audio();
    
    return () => {
      audioRef.current = null;
    };
  }, []);

  const handleVoiceToggle = async () => {
    if (isRecording) {
      // Stop recording
      try {
        setIsRecording(false);
        const audioData = await audioRecorderRef.current?.stop();
        
        if (!audioData) return;

        setIsLoading(true);

        // Transcribe audio
        const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('speech-to-text', {
          body: { audioData }
        });

        if (transcriptionError) throw transcriptionError;

        const transcribedText = transcriptionData.text;
        
        // Add user message
        const userMessage: Message = { role: "user", content: transcribedText };
        setMessages(prev => [...prev, userMessage]);

        // Get AI response
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              messages: [...messages, userMessage],
            }),
          }
        );

        if (!response.ok || !response.body) {
          throw new Error("Failed to get response from AI");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  assistantContent += content;
                  setMessages((prev) => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage?.role === "assistant") {
                      return [
                        ...prev.slice(0, -1),
                        { role: "assistant", content: assistantContent },
                      ];
                    }
                    return [...prev, { role: "assistant", content: assistantContent }];
                  });
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }

        // Convert response to speech
        const { data: ttsData, error: ttsError } = await supabase.functions.invoke('text-to-speech', {
          body: { text: assistantContent }
        });

        if (ttsError) throw ttsError;

        // Play audio
        if (audioRef.current && ttsData.audioData) {
          setIsPlaying(true);
          audioRef.current.src = `data:audio/mpeg;base64,${ttsData.audioData}`;
          audioRef.current.onended = () => setIsPlaying(false);
          await audioRef.current.play();
        }

      } catch (error: any) {
        console.error("Error in voice flow:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to process voice input",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Start recording
      try {
        await audioRecorderRef.current?.start();
        setIsRecording(true);
        toast({
          title: "Listening",
          description: "Speak now... Tap again to stop",
        });
      } catch (error: any) {
        toast({
          title: "Microphone Access Required",
          description: "Please grant microphone permissions to use voice features",
          variant: "destructive",
        });
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response from AI");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantContent += content;
                setMessages((prev) => {
                  const lastMessage = prev[prev.length - 1];
                  if (lastMessage?.role === "assistant") {
                    return [
                      ...prev.slice(0, -1),
                      { role: "assistant", content: assistantContent },
                    ];
                  }
                  return [...prev, { role: "assistant", content: assistantContent }];
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error("Error calling AI:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 px-4" id="chat">
      <div className="container mx-auto max-w-4xl relative">
        <div className="fixed bottom-6 right-6 z-50">
          <div dangerouslySetInnerHTML={{ __html: '<elevenlabs-convai agent-id="agent_1701k8gg4jcefj686sc6ce9rm61a"></elevenlabs-convai>' }} />
        </div>
        
        <Card className="bg-[var(--gradient-card)] shadow-[var(--shadow-soft)] border-border/50">
          <div className="h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } animate-in fade-in slide-in-from-bottom-2 duration-500`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about symptoms, medications, or wellness tips..."
                  className="bg-background border-border focus-visible:ring-primary"
                  disabled={isLoading || isRecording}
                />
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  className={`flex-shrink-0 ${isRecording ? 'animate-pulse' : ''}`}
                  onClick={handleVoiceToggle}
                  disabled={isLoading}
                >
                  {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={handleSend}
                  variant="default"
                  size="icon"
                  className="flex-shrink-0"
                  disabled={isLoading || isRecording}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {isRecording && (
                <p className="text-xs text-primary mt-2 text-center animate-pulse">
                  🎤 Listening... Tap mic again to stop
                </p>
              )}
              {isPlaying && (
                <p className="text-xs text-primary mt-2 text-center flex items-center justify-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  Playing response...
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Your voice stays private and secure
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ChatInterface;
