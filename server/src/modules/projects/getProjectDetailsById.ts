import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getProjectDetailsById = async (req: Request, res: Response) => {
    try {
        const projects = await prisma.projects.findMany({
            select: {
                project_id: true,
                name: true,
                Client: {
                    select: {
                        first_name: true,
                        second_name: true,
                        company_name: true,
                        address: true,
                        ClientPhone: true,
                        ClientEmail: true,
                        ClientMeeting: {
                            select: {
                                time_spent: true,
                                date: true,
                                Project: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                },
                Status: {
                    select: {
                        name: true
                    }
                },
                ProjectDetail: {
                    select: {
                        deadline: true,
                        repo_link: true,
                        figma_link: true
                    }
                },
                ProjectTask: {
                    select: {
                        Task: {
                            select: {
                                task_name: true,
                                deadline: true,
                                Status: true
                            }
                        }
                    }
                },
                InvoiceProduct: {
                    select: {
                        invoice_product_id: true,
                        product_name: true
                    }
                },
                ProjectDoc: {
                    select: {
                        Note: {
                            select: {
                                note_id: true,
                                note_name: true
                            }
                        }
                    }
                },
                Contract: true
            }
        });

        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching project details:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};