package dto

type CreateIncidentDTO struct {
    Title       string `json:"title"       binding:"required,min=3"`
    Description string `json:"description" binding:"required"`
    Category    string `json:"category"    binding:"required,oneof=Safety Maintenance"`
    Status      string `json:"status"      binding:"required,oneof=Open 'In Progress' Success"`
}

type UpdateIncidentDTO struct {
    Title       string `json:"title"       binding:"required,min=3"`
    Description string `json:"description" binding:"required"`
    Category    string `json:"category"    binding:"required,oneof=Safety Maintenance"`
    Status      string `json:"status"      binding:"required,oneof=Open 'In Progress' Success"`
}