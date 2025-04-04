import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { MessageSquare, Send, X, Sparkles, Loader2, Bot, User } from "lucide-react"
import { useAIAssistant } from "@/hooks/useAI"
import { cn } from "@/utils/cn"

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hi! I'm your AI Cinematic Assistant. How can I help you discover your next favorite movie today?" }
    ])
    const scrollRef = useRef<HTMLDivElement>(null)
    const { mutate: getResponse, isPending } = useAIAssistant()

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isPending) return

        const userMsg = input.trim()
        setInput("")
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])

        getResponse({ prompt: userMsg }, {
            onSuccess: (response) => {
                setMessages(prev => [...prev, { role: 'assistant', content: response }])
            }
        })
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl border-primary/20 animate-in slide-in-from-bottom-4 duration-300">
                    <CardHeader className="p-4 border-b bg-primary/5 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-primary rounded-lg">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <CardTitle className="text-sm font-bold">Cinematic Assistant</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin" ref={scrollRef}>
                        {messages.map((msg, i) => (
                            <div key={i} className={cn(
                                "flex gap-3 max-w-[85%]",
                                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                            )}>
                                <div className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                                    msg.role === 'assistant' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                )}>
                                    {msg.role === 'assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                </div>
                                <div className={cn(
                                    "p-3 rounded-2xl text-sm",
                                    msg.role === 'assistant' ? "bg-muted/50 rounded-tl-none" : "bg-primary text-white rounded-tr-none"
                                )}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isPending && (
                            <div className="flex gap-3 max-w-[85%]">
                                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                    <Bot className="h-4 w-4" />
                                </div>
                                <div className="p-3 rounded-2xl bg-muted/50 rounded-tl-none">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <form onSubmit={handleSend} className="p-4 border-t bg-background">
                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about movies..."
                                className="flex-1"
                            />
                            <Button type="submit" size="icon" disabled={isPending}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                </Card>
            ) : (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full shadow-2xl hover:scale-110 transition-transform duration-200"
                >
                    <Sparkles className="h-6 w-6" />
                </Button>
            )}
        </div>
    )
}
