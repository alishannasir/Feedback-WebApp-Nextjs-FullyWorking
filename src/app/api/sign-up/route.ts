/* eslint-disable @typescript-eslint/no-unused-vars */
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server"; // Import Next.js response

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();
        
        // Check if username is already taken by a verified user
        const existingUserCertifiedByUsername = await UserModel.findOne({
            username,
            isverified: true, // Corrected camelCase
        });

        if (existingUserCertifiedByUsername) {
            return NextResponse.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 });
        }

        // Check if the email already exists
        const existingUserByEmail = await UserModel.findOne({ email });

        // Generate verification code
        const verifyCode = Math.floor(10000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isverified) {
                return NextResponse.json({
                    success: false,
                    message: 'User already registered with this email'
                }, { status: 400 });
            } else {
                // Update unverified user with new password and verification code
                const hashPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1-hour expiry
                await existingUserByEmail.save();
            }
        } else {
            // Register a new user
            const hashPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1); // Set expiry 1 hour from now

            const newUser = new UserModel({
                username,
                email,
                password: hashPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });

            await newUser.save();
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if (!emailResponse.success) {
            return NextResponse.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'User registered successfully, please verify'
        }, { status: 200 });

    } catch (error) {
        console.error("Error registering user", error);
        return NextResponse.json({
            success: false,
            message: "Error registering user"
        }, { status: 500 });
    }
}
