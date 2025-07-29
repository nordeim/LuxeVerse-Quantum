'use client'

import { useState, useRef, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { useSession } from '@/hooks/use-session'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIChatAssistantProps {
  className?: string
  context?: {
    currentPage?: string
    productId?: string
  }
}

export function AIChatAssistant({ className, context }: AIChatAssistantProps) {
  const { user } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your personal style assistant. How can I help you find the perfect luxury pieces today?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState<string>()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const chatMutation = api.ai.chat.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        },
      ])
      setConversationId(data.conversationId)
    },
  })

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')

    chatMutation.mutate({
      message: userMessage.content,
      conversationId,
      context,
    })
  }

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const suggestedQuestions = [
    'What\'s trending this season?',
    'Help me find a gift',
    'What matches with this?',
    'Show me sustainable options',
  ]

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={cn(
          'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg',
          isOpen && 'hidden',
          className
        )}
      >
        <Icons.messageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      <Card
        className={cn(
          'fixed bottom-6 right-6 w-96 transition-all',
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none',
          className
        )}
        style={{ height: '600px' }}
      >
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="flex items-center gap-2">
            <Icons.sparkles className="h-5 w-5 text-primary" />
            AI Style Assistant
          </CardTitle>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsOpen(false)}
          >
            <Icons.x className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex h-full flex-col p-0" style={{ height: 'calc(100% - 73px)' }}>
          {/* Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' && 'justify-end'
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/ai-assistant-avatar.png" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg px-4 py-2',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="mt-1 text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatarUrl || undefined} />
                      <AvatarFallback>
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {chatMutation.isPending && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg bg-muted px-4 py-2">
                    <Icons.ellipsis className="h-4 w-4 animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="border-t p-4">
              <p className="mb-2 text-xs text-muted-foreground">
                Try asking:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                  <Button
                    key={question}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInput(question)
                      handleSend()
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about style..."
                disabled={chatMutation.isPending}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || chatMutation.isPending}
              >
                <Icons.send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
