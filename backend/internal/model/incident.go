package model

import "time"

type Category string
type Status string

const (
    CategorySafety      Category = "Safety"
    CategoryMaintenance Category = "Maintenance"
)

const (
    StatusOpen       Status = "Open"
    StatusInProgress Status = "In Progress"
    StatusSuccess    Status = "Success"
)

type Incident struct {
    ID          string    `json:"id"          gorm:"primaryKey;type:uuid"`
    Title       string    `json:"title"       gorm:"not null"`
    Description string    `json:"description" gorm:"not null"`
    Category    Category  `json:"category"    gorm:"type:varchar(20);not null"`
    Status      Status    `json:"status"      gorm:"type:varchar(20);not null;default:'Open'"`
    CreatedAt   time.Time `json:"created_at"`
    UpdatedAt   time.Time `json:"updated_at"`
}