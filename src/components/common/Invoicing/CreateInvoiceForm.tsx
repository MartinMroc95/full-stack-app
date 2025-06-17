import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from 'components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { Separator } from 'components/ui/separator'

interface InvoiceItem {
  id: string
  description: string
  amount: number
}

interface InvoiceResponse {
  invoice: {
    id: string
    stripeInvoiceId: string
    amount: number
    status: string
    url: string
  }
  error?: string
}

const CreateInvoiceForm: React.FC = () => {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null)

  const handleAddItem = () => {
    setItems([...items, { id: crypto.randomUUID(), description: '', amount: 0 }])
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === 'amount' ? parseFloat(value as string) || 0 : value,
            }
          : item,
      ),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/stripe/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          amount: parseFloat(amount) || 0,
          items,
        }),
      })

      const data = (await response.json()) as InvoiceResponse

      if (response.ok && data.invoice) {
        toast.success('Invoice created', {
          description: `Invoice #${data.invoice.stripeInvoiceId} created successfully.`,
        })

        setInvoiceUrl(data.invoice.url)

        // Reset form
        setDescription('')
        setAmount('')
        setItems([])
      } else {
        throw new Error(data.error || 'Failed to create invoice')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong'
      toast.error('Error creating invoice', {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-[600px] mx-auto">
      <CardHeader>
        <CardTitle>Create New Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            void handleSubmit(e)
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Main service or product"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              min={0}
              step={0.01}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          {items.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Additional Line Items</Label>
                <Separator className="flex-1 mx-4" />
              </div>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <div className="flex-1">
                      <Input
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        placeholder="Item description"
                        className="h-9"
                      />
                    </div>
                    <div className="w-[120px]">
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={item.amount === 0 ? '' : item.amount}
                        onChange={(e) => handleItemChange(item.id, 'amount', e.target.value)}
                        placeholder="0.00"
                        className="h-9"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-red-500 hover:text-red-600"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Line Item
            </Button>
          </div>

          <div className="flex justify-between gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Invoice'}
            </Button>

            {invoiceUrl && (
              <Button asChild variant="default" className="bg-green-500 hover:bg-green-600">
                <a href={invoiceUrl} target="_blank" rel="noopener noreferrer">
                  View Invoice
                </a>
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateInvoiceForm
