import { jwt } from '@elysiajs/jwt';
import { PrismaClient } from "../../generated/prisma"
import { AdminInterface } from "../interface/AdminInterface"
import { t } from 'elysia';
import { request } from 'http';
const prisma = new PrismaClient()

const adminToken = async (request: any, my_jwt: any) => {
    const token = request.headers.get("Authorization").replace("Bearer ", "");
    const payload = await my_jwt.verify(token);

    return payload.id;
}

export const AdminController = {
    create: async ({ body }: { body: AdminInterface }) => {
        try {
            const admin = await prisma.admin.create({
                data: body
            })
            return admin;
        }catch (error) {
            console.error("Error creating admin:", error);
            return error;
                
            
        }
    },
    signin: async ({ body, my_jwt } : {
        body : {
            username: string;
            password: string;
        },
        my_jwt: any
    }) => {
        try{
            // เพิ่มการตรวจสอบ jwt
            if (!my_jwt) {
                console.error("JWT is not available");
                return new Response('Server configuration error', {status: 500});
            }

            const admin = await prisma.admin.findUnique({
                where: {
                    username: body.username,
                    password: body.password,
                    status: "active"
                }
            })

            if (!admin) {
                return new Response('unauthorized', {status: 401});
            }
            
            const token = await my_jwt.sign(admin)
            return { token: token };
        }catch (error) {
            console.error("Signin error:", error);
            return new Response('Internal server error', {status: 500});
        }
    },
    info: async ({ request, my_jwt } : {
        request : {
            headers: {
                Authorization: string | null;
            }
        },
        my_jwt: any
    }) => {
        try {
            console.log(request.headers.Authorization);
            const token = request.headers.get("Authorization").replace("Bearer ", "");
            const payload = await my_jwt.verify(token);
            const admin = await prisma.admin.findUnique({
                where: {
                    id: payload.id
                },
                select: {
                    name: true,
                    username: true,
                    level: true,
                }
            })

            return admin;   
        } catch (error) {
            console.error("Error fetching admin info:", error);
            return new Response('Internal server error', {status: 500});
        }
    },
    update: async ({ body, my_jwt, request } : {
        body: AdminInterface,
        my_jwt: any,
        request: any
    }) => {
        try{
            const admintoken = await adminToken(request, my_jwt);
            const oldadmin = await prisma.admin.findUnique({
                where: {
                    id: admintoken
                }
            })
            const admin = await prisma.admin.update({
                data : {
                    name: body.name,
                    username: body.username,
                    password: body.password ?? oldadmin?.password,
                    
                },
                where: {
                    id: admintoken
                }
            })
            return admin;
        } catch (error) {
            console.error("Error updating admin:", error);
            return new Response('Internal server error', {status: 500});
        }
    },
    list: async () => {
        try {
            const admins = await prisma.admin.findMany({
                select: {
                    id: true,
                    name: true,
                    username: true,
                    level: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
            return admins;
        } catch (error) {
            console.error("Error listing admins:", error);
            return new Response('Internal server error', {status: 500});
        }
    }
}