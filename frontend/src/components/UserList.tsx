import { useState, useEffect } from "react"
import axios from "axios"
import { Loader2, UserPlus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserFormDialog } from "@/components/user-form-dialog"
import { DeleteUserDialog } from "@/components/delete-user-dialog"
import { useToast } from "@/hooks/use-toast"

const API_URL = import.meta.env.VITE_API_URL

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`${API_URL}/users`)
      setUsers(response.data)
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (userData: Omit<User, "id">) => {
    try {
      await axios.post(`${API_URL}/users`, userData)
      toast({
        title: "User created",
        description: "The user has been successfully created.",
      })
      fetchUsers()
    } catch (err) {
      let errorMessage = "Failed to create user"
      if (axios.isAxiosError(err) && err.response?.data) {
        // Laravel validation errors format
        const errors = err.response.data.errors || err.response.data
        if (typeof errors === 'object') {
          const errorMessages = Object.values(errors).flat()
          errorMessage = errorMessages.join(', ') || err.response.data.message || errorMessage
        } else if (typeof errors === 'string') {
          errorMessage = errors
        } else {
          errorMessage = err.response.data.message || err.message || errorMessage
        }
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  const handleUpdateUser = async (userData: Omit<User, "id">) => {
    if (!selectedUser) return
    try {
      await axios.put(`${API_URL}/users/${selectedUser.id}`, userData)
      toast({
        title: "User updated",
        description: "The user has been successfully updated.",
      })
      fetchUsers()
    } catch (err) {
      let errorMessage = "Failed to update user"
      if (axios.isAxiosError(err) && err.response?.data) {
        // Laravel validation errors format
        const errors = err.response.data.errors || err.response.data
        if (typeof errors === 'object') {
          const errorMessages = Object.values(errors).flat()
          errorMessage = errorMessages.join(', ') || err.response.data.message || errorMessage
        } else if (typeof errors === 'string') {
          errorMessage = errors
        } else {
          errorMessage = err.response.data.message || err.message || errorMessage
        }
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return
    try {
      await axios.delete(`${API_URL}/users/${selectedUser.id}`)
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
      })
      fetchUsers()
    } catch (err) {
      toast({
        title: "Error",
        description: axios.isAxiosError(err) ? err.message : "Failed to delete user",
        variant: "destructive",
      })
      throw err
    }
  }

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">User Management</CardTitle>
              <CardDescription>Manage your application users</CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {users.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(user)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <UserFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateUser}
        title="Create New User"
        description="Add a new user to the system. Fill in all required fields."
      />

      <UserFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={selectedUser}
        onSubmit={handleUpdateUser}
        title="Edit User"
        description="Update the user information below."
      />

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        userName={selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : ""}
        onConfirm={handleDeleteUser}
      />
    </div>
  )
}
