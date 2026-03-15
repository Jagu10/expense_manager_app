import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma/client";
 
const adapter = new PrismaMariaDb({ 
    host:"localhost", 
    port:3306, 
    user:"root", 
    password:"18E200@e", 
    database:"expense_manager", 
    connectionLimit:5 
}) 
 
export const prisma = new PrismaClient({adapter}); 