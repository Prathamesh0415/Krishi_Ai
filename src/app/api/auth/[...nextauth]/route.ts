import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import bcrypt from 'bcryptjs'
import connectDB from "@/lib/connectDB";
import  CredentialsProvider  from "next-auth/providers/credentials";
import User from "@/models/userModel";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }), 
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                name:{
                    label: "name",
                    type: "string"
                },
                email: {
                    label: "email",
                    type: "email"
                },
                password: {
                    label: "password",
                    type: "password" 
                },
                mode: {
                    label: "mode",
                    type: "string"
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password){
                    throw new Error("Email and Password are required")
                }
                await connectDB()

                const user = await User.findOne({ email: credentials.email});
                
                if(credentials?.mode == "signup"){
                    if(user) throw new Error("User already exists")
                    const hashedPassword = await bcrypt.hash(credentials?.password, 10)
                    const newUser = await User.create({
                        name: credentials?.name,
                        email: credentials?.email,
                        password: hashedPassword
                    })

                    return newUser
                }

                if(!user) throw new Error ("No user found with this email");
                
                const isValid = await bcrypt.compare(credentials.password, user.password!)
                if(!isValid) throw new Error("email or password invalid") 
            
                return user;
            }
        })  
    ],
    callbacks: {
        async signIn({ user, account }){
            await connectDB()

            if (account?.provider === "google"){
                const existingUser = await User.findOne({ email: user.email });
                if(!existingUser){
                    await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image
                    })
                }
            }

            return true
            
        },
        async session({ session }) {
            await connectDB();
            const dbUser = await User.findOne({ email: session.user?.email })
            if(dbUser){
                (session.user as any).id = dbUser._id.toString();
            }

            return session
        }},
        pages: {
            signIn: "/login"
        },
        secret: process.env.NEXT_AUTH_SECRET
};

const handler = NextAuth(authOptions)
export { handler as GET, handler as  POST}

