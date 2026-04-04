import NextAuth from "next-auth"
import  Credentials  from "next-auth/providers/credentials"
import {db} from "@/lib/db"
import bcrypt from "bcryptjs"
    

import React from 'react'

export const { handlers, signIn, signOut, auth} = NextAuth({
    session: {strategy: "jwt"},
    providers: [
        Credentials({
            name: "credentials",
            credentials: {

                email: {label:"Email", type:"email"},
                password: {label: "Password", type:"passwords"}
            },

            async authorize(credentials) {

                if(!credentials?.email || !credentials.password) {
                    return null;
                }
                const user = await db.user.findUnique({
                    where: {email:credentials.email as string},
                });

                if (!user || !user.password) return null;

                const passwordMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!passwordMatch) return null;

                return {

                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.role = (user as any).role;
      token.name = user.name;
      token.email = user.email;
    }
    return token;
  },
  async session({ session, token }) {

    // Verify user still exist on DB 
    const dbUser = await db.user.findUnique({
        where: {id: token.id as string}
    });

    if(!dbUser) {
        return {
            ...session, user: undefined as any
        }
    }
    return {
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
        name: token.name,
        email: token.email,
        role: token.role,
      },
    };
  },
},
    pages: {
        signIn: "/signIn"
    },
});