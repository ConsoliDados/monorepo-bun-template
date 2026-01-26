// Exemplo de schema usando Zod ou TypeBox
export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

export interface CreateUserInput {
  name: string
  email: string
}
