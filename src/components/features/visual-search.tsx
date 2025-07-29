'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface VisualSearchProps {
  children?: React.ReactNode
  className?: string
}

export function VisualSearch({ children, className }: VisualSearchProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  
  const visualSearchMutation = api.ai.visualSearch.useMutation({
    onSuccess: (data) => {
      // Store results in session storage
      sessionStorage.setItem('visualSearchResults', JSON.stringify(data))
      // Navigate to search results page
      router.push('/search?mode=visual')
      setOpen(false)
    },
    onError: (error) => {
      toast({
        title: 'Search failed',
        description: error.message || 'Failed to search for similar products',
        variant: 'destructive',
      })
    },
  })

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file',
        variant: 'destructive',
      })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // In a real app, upload to cloud storage first
    // For demo, we'll use a data URL
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })

    setImageUrl(dataUrl)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleSearch = () => {
    if (!imageUrl) {
      toast({
        title: 'No image',
        description: 'Please upload or provide an image URL',
        variant: 'destructive',
      })
      return
    }

    visualSearchMutation.mutate({ imageUrl })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className={className}>
            <Icons.camera className="mr-2 h-4 w-4" />
            Visual Search
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Visual Search</DialogTitle>
          <DialogDescription>
            Upload an image or provide a URL to find similar products
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Upload Area */}
          <Card
            className={cn(
              'border-2 border-dashed transition-colors',
              isDragging && 'border-primary bg-primary/5'
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <CardContent className="flex flex-col items-center justify-center p-12">
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 rounded-lg object-contain"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -right-2 -top-2"
                    onClick={() => {
                      setPreviewUrl('')
                      setImageUrl('')
                    }}
                  >
                    <Icons.x className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Icons.upload className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    Drag and drop an image here, or click to browse
                  </p>
                  <Button
                    variant="secondary"
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose File
                  </Button>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleFileUpload(file)
                      }
                    }}
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="image-url">Or paste an image URL</Label>
            <div className="flex gap-2">
              <Input
                id="image-url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value)
                  setPreviewUrl(e.target.value)
                }}
              />
              <Button
                variant="outline"
                onClick={() => {
                  if (imageUrl && imageUrl.startsWith('http')) {
                    setPreviewUrl(imageUrl)
                  }
                }}
              >
                Preview
              </Button>
            </div>
          </div>

          {/* Search Tips */}
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">Tips for best results:</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• Use clear, well-lit images</li>
              <li>• Focus on a single product</li>
              <li>• Avoid busy backgrounds</li>
              <li>• Show the full item when possible</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={visualSearchMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSearch}
              disabled={!imageUrl || visualSearchMutation.isPending}
            >
              {visualSearchMutation.isPending ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Icons.search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
