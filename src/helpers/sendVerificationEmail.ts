/* eslint-disable @typescript-eslint/no-unused-vars */
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import Verification from "../../emails/VerificationsEmail"
export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string,
): Promise<ApiResponse>{
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'Mystry message | Verification Code ',
            react: Verification({username, otp:verifyCode}),
          });
        return {success:true,message:"successfully sending verifiaction email"}
    } catch (emailerror) {
        console.error("error sending verification email.", emailerror);
        return {success:false,message:"failed to send verifiaction email"}
        
    }
}