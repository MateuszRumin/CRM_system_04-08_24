import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getProjectDetailsById = async (req: Request, res: Response) => {
    try {
        const { project_id } = req.params;

        if (!project_id) {
            return res.status(400).json({ error: 'Missing project_id parameter' });
        }
        
        const projectExists = await prisma.projects.findFirst({
            where: { project_id: parseInt(project_id) }
        });

        if (!projectExists) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const project = await prisma.projects.findUnique({
            where: { project_id: parseInt(project_id, 10) },
            select: {
                project_id: true,
                name: true,
                ProjectLink: {
                    select: {
                        link_id:true,
                        link_type:true,
                        link:true,
                    }
                },
                Client: {
                    select: {
                        client_id:true,
                        first_name: true,
                        second_name: true,
                        company_name: true,
                        address: true,
                        ClientPhone: true,
                        ClientEmail: true,
                        // ClientMeeting: {
                        //     select: {
                        //         time_spent: true,
                        //         date: true,
                        //         Project: {
                        //             select: {
                        //                 name: true
                        //             }
                        //         }
                        //     }
                        // }
                    }
                },
                Status: {
                    select: {
                        status_id:true,
                        status_type:true,
                        name: true
                    }
                },
                ProjectDetail: {
                    select: {
                        deadline: true,
                        // repo_link: true,
                        // figma_link: true
                    }
                },
                ProjectTask: {
                    select: {
                        Task: {
                            select: {
                                task_id:true,
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
                        product_name: true,
                        Invoice: {
                            select: {
                                invoice_id:true,
                                invoice_number:true,
                            }
                        }
                    }
                },
                ProjectDoc: {
                    select: {
                        project_doc_id:true,
                        file_name:true,
                        doc_description:true,
                        ProjectLink: {
                            select: {
                                link_id:true,
                                link:true,
                            }
                        },
                    }
                },
                Contract: true,
                ProjectMeeting: {
                    include: {
                        Meeting: {
                            select: {
                                time_spent:true,
                                date:true,
                            }
                        },
                        Project: {
                            select: {
                                name:true,
                            }
                        }
                    }
                },
                ProjectAssignment: {
                    select: {
                        User: {
                            select: {
                                UserData: {
                                    select: {
                                        user_id:true,
                                        first_name:true,
                                        second_name:true,
                                        Position: {
                                            select: {
                                                name:true,
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (error) {
        console.error("Error fetching project details:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};