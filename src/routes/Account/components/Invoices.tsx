import React, { useEffect, useState } from 'react'
import CreateInvoiceForm from 'components/common/Invoicing/CreateInvoiceForm'
import { Badge } from 'components/ui/badge'
import { Button } from 'components/ui/button'
import { Card, CardContent } from 'components/ui/card'

interface Invoice {
  id: string
  stripeInvoiceId: string
  amount: number
  status: string
  paidAt: string | null
  createdAt: string
}

interface ApiResponse {
  invoices: Invoice[]
  error?: string
}

const Invoices: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('/api/invoices')
        const data = (await response.json()) as ApiResponse

        if (response.ok) {
          setInvoices(data.invoices)
        } else {
          console.error('Failed to fetch invoices:', data.error)
        }
      } catch (error) {
        console.error('Error fetching invoices:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchInvoices()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500'
      case 'open':
        return 'bg-yellow-500'
      case 'failed':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) {
      return '-'
    }
    return new Date(date).toLocaleDateString()
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount / 100) // Convert cents to euros

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-[200px]">
          <div className="flex items-center justify-center w-full h-full">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent" />
          </div>
        </div>
      )
    }

    if (invoices.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-lg">No invoices found.</p>
        </div>
      )
    }

    return (
      <div className="w-full h-full mx-0">
        <Card>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">Invoice ID</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Paid Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">{invoice.stripeInvoiceId}</td>
                      <td className="p-4 align-middle">
                        {formatDate(new Date(invoice.createdAt))}
                      </td>
                      <td className="p-4 align-middle">{formatCurrency(invoice.amount)}</td>
                      <td className="p-4 align-middle">
                        <Badge
                          className={`${getStatusColor(invoice.status)} hover:bg-${getStatusColor(invoice.status)} hover:cursor-default`}
                        >
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        {formatDate(invoice.paidAt ? new Date(invoice.paidAt) : null)}
                      </td>
                      <td className="p-4 align-end">
                        <Button variant="outline" size="sm">
                          <a
                            href={`/api/invoices/${invoice.id}/pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Download PDF
                          </a>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Button
          onClick={() => {
            setIsOpen(true)
          }}
        >
          Create Invoice
        </Button>
      </div>

      <div className={`mb-6 ${isOpen ? 'block' : 'hidden'}`}>
        <CreateInvoiceForm />
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            setIsOpen(false)
          }}
        >
          Close Form
        </Button>
      </div>

      {renderContent()}
    </div>
  )
}

export default Invoices
