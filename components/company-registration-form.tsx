"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Plus, X, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProductData {
  id: string
  sku?: string
  barcode?: string
  packagingType: string
  materials: { material: string; percentage: number }[]
  unitWeight: number
  recyclability: "yes" | "no" | "partial"
  recyclabilityComments?: string
}

export function CompanyRegistrationForm() {
  const { user, updateCompanyData } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    // Company identity
    companyName: "",
    brandNames: [""],
    companyId: "",
    contactPerson: "",
    contactEmail: "",
    accountAdmin: "",
    accountAdminEmail: "",
    logoUrl: "",

    // Operational metadata
    rvmPartnerIds: [""],
    defaultCurrency: "USD",
    defaultRegion: "",
    materialMappingPreference: "",

    // Products
    products: [] as ProductData[],

    // Targets & policy
    sustainabilityTargets: "",
    reportingBoundary: "",
    verificationStatus: "self-reported" as "self-reported" | "third-party-verified",
    certificateUrl: "",

    // Permissions
    consentPublicDashboard: false,
    consentDataSharing: false,
  })

  useEffect(() => {
    if (user?.companyData) {
      setFormData(user.companyData)
    }
  }, [user])

  const addBrandName = () => {
    setFormData((prev) => ({
      ...prev,
      brandNames: [...prev.brandNames, ""],
    }))
  }

  const removeBrandName = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      brandNames: prev.brandNames.filter((_, i) => i !== index),
    }))
  }

  const updateBrandName = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      brandNames: prev.brandNames.map((name, i) => (i === index ? value : name)),
    }))
  }

  const addRvmPartnerId = () => {
    setFormData((prev) => ({
      ...prev,
      rvmPartnerIds: [...prev.rvmPartnerIds, ""],
    }))
  }

  const removeRvmPartnerId = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rvmPartnerIds: prev.rvmPartnerIds.filter((_, i) => i !== index),
    }))
  }

  const updateRvmPartnerId = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      rvmPartnerIds: prev.rvmPartnerIds.map((id, i) => (i === index ? value : id)),
    }))
  }

  const addProduct = () => {
    const newProduct: ProductData = {
      id: Date.now().toString(),
      packagingType: "",
      materials: [{ material: "", percentage: 0 }],
      unitWeight: 0,
      recyclability: "yes",
    }
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, newProduct],
    }))
  }

  const removeProduct = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
    }))
  }

  const updateProduct = (productId: string, updates: Partial<ProductData>) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === productId ? { ...p, ...updates } : p)),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateCompanyData(formData)
    toast({
      title: "Registration Updated",
      description: "Your company registration has been successfully updated.",
    })
    router.push("/dashboard/reports")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Edit Company Registration</CardTitle>
            <CardDescription>Update your company details and registration information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Company Identity */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Company Identity</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyId">Company ID / Tax ID</Label>
                    <Input
                      id="companyId"
                      value={formData.companyId}
                      onChange={(e) => setFormData((prev) => ({ ...prev, companyId: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Brand Names *</Label>
                  {formData.brandNames.map((brand, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={brand}
                        onChange={(e) => updateBrandName(index, e.target.value)}
                        placeholder="Brand name"
                        required={index === 0}
                      />
                      {index > 0 && (
                        <Button type="button" variant="outline" size="icon" onClick={() => removeBrandName(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addBrandName} className="mt-2 bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Brand
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accountAdmin">Account Admin Name *</Label>
                    <Input
                      id="accountAdmin"
                      value={formData.accountAdmin}
                      onChange={(e) => setFormData((prev) => ({ ...prev, accountAdmin: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountAdminEmail">Account Admin Email *</Label>
                    <Input
                      id="accountAdminEmail"
                      type="email"
                      value={formData.accountAdminEmail}
                      onChange={(e) => setFormData((prev) => ({ ...prev, accountAdminEmail: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Operational Metadata */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Operational Metadata</h3>

                <div>
                  <Label>RVM Partner IDs *</Label>
                  {formData.rvmPartnerIds.map((id, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={id}
                        onChange={(e) => updateRvmPartnerId(index, e.target.value)}
                        placeholder="RVM Partner ID"
                        required={index === 0}
                      />
                      {index > 0 && (
                        <Button type="button" variant="outline" size="icon" onClick={() => removeRvmPartnerId(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addRvmPartnerId} className="mt-2 bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Add RVM Partner ID
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="defaultCurrency">Default Currency</Label>
                    <Select
                      value={formData.defaultCurrency}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, defaultCurrency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="defaultRegion">Default Region</Label>
                    <Input
                      id="defaultRegion"
                      value={formData.defaultRegion}
                      onChange={(e) => setFormData((prev) => ({ ...prev, defaultRegion: e.target.value }))}
                      placeholder="e.g., North America, Europe"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="materialMappingPreference">Material Mapping Preference *</Label>
                  <Textarea
                    id="materialMappingPreference"
                    value={formData.materialMappingPreference}
                    onChange={(e) => setFormData((prev) => ({ ...prev, materialMappingPreference: e.target.value }))}
                    placeholder="Describe how your brand maps SKUs to materials"
                    required
                  />
                </div>
              </div>

              {/* Product Data */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Product Data</h3>

                {formData.products.map((product, index) => (
                  <Card key={product.id} className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Product {index + 1}</h4>
                      <Button type="button" variant="outline" size="sm" onClick={() => removeProduct(product.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>SKU</Label>
                        <Input
                          value={product.sku || ""}
                          onChange={(e) => updateProduct(product.id, { sku: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Barcode</Label>
                        <Input
                          value={product.barcode || ""}
                          onChange={(e) => updateProduct(product.id, { barcode: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Packaging Type *</Label>
                        <Select
                          value={product.packagingType}
                          onValueChange={(value) => updateProduct(product.id, { packagingType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bottle">Bottle</SelectItem>
                            <SelectItem value="can">Can</SelectItem>
                            <SelectItem value="carton">Carton</SelectItem>
                            <SelectItem value="pouch">Pouch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Unit Weight (g) *</Label>
                        <Input
                          type="number"
                          value={product.unitWeight}
                          onChange={(e) =>
                            updateProduct(product.id, { unitWeight: Number.parseFloat(e.target.value) || 0 })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label>Recyclability *</Label>
                        <Select
                          value={product.recyclability}
                          onValueChange={(value: "yes" | "no" | "partial") =>
                            updateProduct(product.id, { recyclability: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                ))}

                <Button type="button" variant="outline" onClick={addProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              {/* Targets & Policy */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Targets & Policy</h3>

                <div>
                  <Label htmlFor="sustainabilityTargets">Sustainability Targets</Label>
                  <Textarea
                    id="sustainabilityTargets"
                    value={formData.sustainabilityTargets}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sustainabilityTargets: e.target.value }))}
                    placeholder="e.g., Recover 50% of sold packaging by 2030"
                  />
                </div>

                <div>
                  <Label htmlFor="reportingBoundary">Reporting Boundary</Label>
                  <Textarea
                    id="reportingBoundary"
                    value={formData.reportingBoundary}
                    onChange={(e) => setFormData((prev) => ({ ...prev, reportingBoundary: e.target.value }))}
                    placeholder="e.g., returns to our brand-labeled RVMs only"
                  />
                </div>

                <div>
                  <Label>Verification Status</Label>
                  <Select
                    value={formData.verificationStatus}
                    onValueChange={(value: "self-reported" | "third-party-verified") =>
                      setFormData((prev) => ({ ...prev, verificationStatus: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self-reported">Self-reported</SelectItem>
                      <SelectItem value="third-party-verified">Third-party Verified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="consentPublicDashboard"
                      checked={formData.consentPublicDashboard}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, consentPublicDashboard: !!checked }))
                      }
                    />
                    <Label htmlFor="consentPublicDashboard">
                      Consent to publish aggregated metrics to public dashboard
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="consentDataSharing"
                      checked={formData.consentDataSharing}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, consentDataSharing: !!checked }))}
                    />
                    <Label htmlFor="consentDataSharing">
                      Consent to share anonymized transactional data with auditors/partners
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard/reports")}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
