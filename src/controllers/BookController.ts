import { Book } from './../../generated/prisma/index.d';
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

import type { BookInterface } from "../interface/BookInterface";

export const BookController = {
    create: async ({ body }: { body:BookInterface } ) => {
        try{
            const book = await prisma.book.create({
                data:{
                    title: body.title,
                    price: body.price,
                    description: body.description,
                    author: body.author
                }
            })
            return book
        }catch (error) {
            console.error("Error creating book:", error);
            return{
                error: "Failed to create book"
            }
        }
    },
    list: async () =>{
        try{
            return await prisma.book.findMany()
        }catch (error) {
            console.error("Error listing books:", error);
            return {
                error: "Failed to list books"
            }
        }
    },
    update: async ({ params, body} : {
        params: { id: string },
        body:BookInterface 
    }) => {
        try{
            const book = await prisma.book.update({
                data: {
                    title: body.title,
                    price: body.price,
                    description: body.description,
                    author: body.author
                },
                where: {
                    id: params.id
                }
            });
            return book;
        } catch (error) {
            console.error("Error updating book:", error);
            return {
                error: "Failed to update book"
            }
        }       
    },
    delete: async ({ params }: {
        params: { id: string }
    }) => {
        try{
            const book = await prisma.book.delete({
                where: {
                    id: params.id
                }
            });
            return {
                message: `Book with ID ${params.id} deleted successfully!`,
                book: book
            }
        } catch (error) {
            console.error("Error deleting book:", error);
            return {
                error: "Failed to delete book"
            }
        }   
    }
}