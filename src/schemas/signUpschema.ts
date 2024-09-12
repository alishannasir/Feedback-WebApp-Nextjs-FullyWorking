import {z} from 'zod'

export const signUpSchema = z.object({
  username: z
  .string()
  .min(3, "Username must atleast 3 characters.")
  .max(20,"Username must be no more than 20 character."),
  email: z
  .string()
  .email({message:"invalid email try another one"}),
   password:z
   .string()
   .min(8,{message:"atleast eight characters"})
})