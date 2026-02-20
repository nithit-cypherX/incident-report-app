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

type IncidentQueryParams struct {
	// Filtering
	Category string `form:"category"`
	Status   string `form:"status"`
	Search   string `form:"search"`

	// Sorting
	SortBy    string `form:"sort_by" binding:"omitempty,oneof=created_at updated_at title"`
	SortOrder string `form:"sort_order" binding:"omitempty,oneof=asc desc"`

	// Pagination
	Page     int `form:"page" binding:"omitempty,min=1"`
	PageSize int `form:"page_size" binding:"omitempty,min=5,max=100"`
}

// Response with pagination metadata
type PaginatedResponse struct {
	Data       interface{} `json:"data"`
	Total      int64       `json:"total"`
	Page       int         `json:"page"`
	PageSize   int         `json:"page_size"`
	TotalPages int         `json:"total_pages"`
}
