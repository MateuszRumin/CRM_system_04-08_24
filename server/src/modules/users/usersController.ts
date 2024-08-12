import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { userInfo } from 'os';
import { sendEmail } from '../../service/emailService'; // Importujemy funkcję do wysyłania emaili

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Funkcja pomocnicza do tworzenia JWT
const createToken = (userId: number, username: string, role: string) => {
    const payload = {
        userId,
        username,
        role
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.users.findMany({
            include: {
                UserData: {
                    include: {
                        Position: true
                    }
                },
                UserRole: {
                    include: {
                        Role: true
                    }
                }
            }
        });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const selectAllCompanyPositions = async (req: Request, res: Response) => {
    try {
            const positions = await prisma.companyPositions.findMany({
        });
        res.status(200).json(positions);
    } catch (error) {
        console.error("Error fetching positions:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const assignUserToProject = async (req: Request, res: Response) => {
    const { user_id} = req.params;
    const { project_id } = req.body;

    const userId = parseInt(user_id);
    const projectId = parseInt(project_id);

    // Check if user exists
    const userExists = await prisma.users.findUnique({
        where: { user_id: userId }
    });

    if (!userExists) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Check if project exists
    const projectExists = await prisma.projects.findUnique({
        where: { project_id: projectId }
    });

    if (!projectExists) {
        return res.status(404).json({ error: 'Project not found' });
    }

    // Check if the user is already assigned to the project
    const existingAssignment = await prisma.projectAssignments.findFirst({
        where: {
            user_id: parseInt(user_id),
            project_id: parseInt(project_id)
        }
    });

    if (existingAssignment) {
        return res.status(400).json({ error: 'User already assigned to this project' });
    }

    try {
        const newProjectAssignment = await prisma.projectAssignments.create({
            data: {
                user_id: userId,
                project_id: projectId
            },
            include: {
                User: true,
                Project: true
            }
        });

        res.status(201).json({ newProjectAssignment });
    } catch (error) {
        console.error(`Error assigning user id ${userId} to project id ${projectId}`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const removeUserFromProject = async (req: Request, res: Response) => {
    const { user_id} = req.params;
    const { project_id } = req.body;
    // Check if user and project exist
    const userExists = await prisma.users.findUnique({
        where: { user_id: parseInt(user_id) }
    });

    if (!userExists) {
        return res.status(404).json({ error: 'User not found' });
    }

    const projectExists = await prisma.projects.findUnique({
        where: { project_id: parseInt(project_id) }
    });

    if (!projectExists) {
        return res.status(404).json({ error: 'Project not found' });
    }

    try {
        // Find the project assignment to delete
        const assignmentToDelete = await prisma.projectAssignments.findFirst({
            where: {
                user_id: parseInt(user_id),
                project_id: parseInt(project_id)
            }
        });

        if (!assignmentToDelete) {
            return res.status(404).json({ error: 'User is not assigned to this project' });
        }

        // Delete the project assignment
        await prisma.projectAssignments.delete({
            where: {
                project_assignment_id: assignmentToDelete.project_assignment_id
            }
        });

        res.status(200).json({ message: `User ${user_id} removed from project ${project_id} successfully` });
    } catch (error) {
        console.error(`Error removing user id ${user_id} from project id ${project_id}`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await prisma.users.findUnique({
            where: { user_id: parseInt(id) },
            include: {
                UserData: {
                    include: {
                        Position: true
                    }
                },
                UserRole: {
                    include: {
                        Role: true,
                    },
                },
                Client: true,
                Task: true,
                Note: true,
                ProjectAssignment: {
                    include: {
                        Project: {
                            include: {
                                Status: true
                            }
                        }

                    }
                }
            },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { email, userData, userRoles, username } = req.body;
  
    try {
      const existingUserByEmail = await prisma.users.findUnique({
        where: { email },
      });
  
      if (existingUserByEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }
  
      // Sprawdź unikalność username
      const existingUserByUsername = await prisma.users.findUnique({
        where: { username },
      });
  
      if (existingUserByUsername) {
        return res.status(400).json({ error: 'Username already exists' });
      }
  
      const tempPassword = uuidv4().slice(0, 12);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
  
      if (userRoles) {
        const roleChecks = await Promise.all(userRoles.map(async (role: { role_id: number }) => {
          const existingRole = await prisma.roles.findUnique({
            where: { role_id: role.role_id },
          });
          return existingRole !== null;
        }));
  
        if (roleChecks.includes(false)) {
          return res.status(400).json({ error: 'One or more roles do not exist' });
        }
      }
  
      if (userData) {
        const positionIds = Array.isArray(userData) ? userData.map(data => data.position_id) : [userData.position_id];
  
        const positionChecks = await Promise.all(positionIds.map(async (position_id) => {
          const existingPosition = await prisma.companyPositions.findUnique({
            where: { position_id },
          });
          return existingPosition !== null;
        }));
  
        if (positionChecks.includes(false)) {
          return res.status(400).json({ error: 'One or more positions do not exist within the company' });
        }
      }
  
      const newUser = await prisma.users.create({
        data: {
          username,
          email,
          password: hashedPassword,
          UserData: userData ? {
            create: Array.isArray(userData) ? userData : [userData],
          } : undefined,
          UserRole: userRoles ? {
            create: userRoles.map((role: { role_id: number }) => ({ role_id: role.role_id })),
          } : undefined,
        },
        include: {
          UserRole: {
            include: {
              Role: {
                              select: {
                                  role_id:true,
                                  name:true,
                              }
                          }
            },
          },
          UserData: {
            include: {
              Position: {
                              select: {
                                  position_id:true,
                                  name:true,
                              }
                          }
            }
          }
        },
      });
  
      await sendEmail(email, 'Twoje dane do logowania', `Login: ${username}\nHasło: ${tempPassword}`);
  
      res.status(201).json({
        newUser: {
          ...newUser,
          password: tempPassword
        },
        username,
        password: tempPassword,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, email, password, userData, userRoles } = req.body;

    try {
        const dataToUpdate: any = {};

        // Sprawdzenie dostępności username
        if (username) {
            const existingUserByUsername = await prisma.users.findUnique({
                where: { username },
            });

            if (existingUserByUsername && existingUserByUsername.user_id !== parseInt(id)) {
                return res.status(400).json({ error: 'Username already exists' });
            }

            dataToUpdate.username = username;
        }

        // Sprawdzenie dostępności emaila
        if (email) {
            const existingUserByEmail = await prisma.users.findUnique({
                where: { email },
            });

            if (existingUserByEmail && existingUserByEmail.user_id !== parseInt(id)) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            dataToUpdate.email = email;
        }

        // Sprawdzenie istnienia roli
        if (userRoles) {
            const roleChecks = await Promise.all(userRoles.map(async (role: { role_id: number }) => {
                const existingRole = await prisma.roles.findUnique({
                    where: { role_id: role.role_id },
                });
                return existingRole !== null;
            }));

            if (roleChecks.includes(false)) {
                return res.status(400).json({ error: 'One or more roles do not exist' });
            }

            dataToUpdate.UserRole = {
                deleteMany: { user_id: parseInt(id) },
                create: userRoles.map((role: { role_id: number }) => ({ role_id: role.role_id })),
            };
        }

        // Sprawdzenie istnienia stanowiska w firmie
        if (userData && userData.position_id) {
            const existingPosition = await prisma.companyPositions.findUnique({
                where: { position_id: userData.position_id },
            });

            if (!existingPosition) {
                return res.status(400).json({ error: 'Position does not exist' });
            }

            dataToUpdate.UserData = {
                update: {
                    where: { user_id: parseInt(id) },
                    data: userData,
                },
            };
        } else if (userData) {
            dataToUpdate.UserData = {
                update: {
                    where: { user_id: parseInt(id) },
                    data: userData,
                },
            };
        }

        // Aktualizacja hasła jesli podane
        if (password) {
            dataToUpdate.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.users.update({
            where: { user_id: parseInt(id) },
            data: dataToUpdate,
            include: {
                UserData: {
                    include: {
                        Position: true,
                    },
                },
                UserRole: {
                    include: {
                        Role: true,
                    },
                },
            },
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const userId = parseInt(id);

        // Sprawdzenie, czy użytkownik istnieje
        const userExists = await prisma.users.findUnique({
            where: { user_id: userId }
        });

        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Usuń wszystkie powiązane dane z innych modeli
        await prisma.$transaction([
            prisma.userDatas.deleteMany({
                where: { user_id: userId }
            }),
            prisma.userRoles.deleteMany({
                where: { user_id: userId }
            }),
            prisma.clients.deleteMany({
                where: { user_id: userId }
            }),
            prisma.tasks.deleteMany({
                where: { user_id: userId }
            }),
            prisma.notes.deleteMany({
                where: { user_id: userId }
            }),
            prisma.projectAssignments.deleteMany({
                where: { user_id: userId }
            }),
            // Usuń użytkownika
            prisma.users.delete({
                where: { user_id: userId }
            })
        ]);

        res.status(200).json({ message: 'User and related data deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        // Sprawdzamy czy username jest dostarczony,
        const user = await prisma.users.findUnique({
            where: { username },
            include: {
                UserRole: {
                    include: {
                        Role: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username' });
        }

        // Sprawdzamy poprawność hasła
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Pobieramy rolę użytkownika
        const userRole = user.UserRole[0].Role.name;

        // Tworzymy token
        const token = createToken(user.user_id, user.username, userRole);

        // Rozpocznij nową sesję
        await prisma.workSessions.create({
            data: {
            user_id: user.user_id,
            token: token,
            startTime: new Date(),
            active: true,
            expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000), //waznosc do 8h od
            },
        });

        // Zwracamy token
        res.status(200).json({ token });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers['authorization']?.split(' ')[1]; // Pobierz token z nagłówka
      
      if (!token) {
        res.status(400).json({ message: 'No token provided' });
        return;
      }

    try {
        jwt.verify(token, JWT_SECRET); // Użyj klucza do dekodowania JWT
      } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
        return;
      }
  
      // Zakończ aktywną sesję
      const session = await prisma.workSessions.findFirst({
        where: {
          token, // Użyj tokena do znalezienia odpowiedniej sesji
          active: true,
        },
      });
  
      if (session) {
        await prisma.workSessions.update({
          where: { session_id: session.session_id },
          data: {
            endTime: new Date(),
            active: false,
          },
        });
      } else {
        res.status(404).json({ message: 'Session not found' });
        return;
      }
  
      res.json({ message: 'Logged out successfully. Session ended. Token destroyed.' });
    } catch (error) {
      console.error('Error logging out:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

export const getWorkSessions = async (req: Request, res: Response): Promise<void> => {
    try {
      const activeSessions = await prisma.workSessions.findMany({
        where: { active: true },
        include: { 
            User: {
                include: {
                    UserRole:{
                        include: {Role:true}
                    }
                }
            }
        }
      });
  
      const endedSessions = await prisma.workSessions.findMany({
        where: { active: false },
        include: { 
            User: {
                include: {
                    UserRole: {
                        include: {Role:true}
                    }
                }
            }
        }
      });
  
      res.json({
        activeSessions,
        endedSessions
      });
    } catch (error) {
      console.error('Error fetching work sessions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteSessionById = async (req: Request, res: Response) => {
    const { session_id } = req.params;

    try {
        // Sprawdzenie, czy session_id jest liczbą
        const sessionId = Number(session_id);

        // Sprawdzenie, czy sesja istnieje
        const session = await prisma.workSessions.findUnique({
            where: { session_id: sessionId }
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Usuń sesję
        await prisma.workSessions.delete({
            where: { session_id: sessionId }
        });

        res.status(200).json({ message: 'Session deleted successfully' });
    } catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteSessionsByMonth = async (req: Request, res: Response) => {
    const { month, year } = req.body;

    if (!month || !year) {
        return res.status(400).json({ error: 'Month and year are required' });
    }

    try {
        // Convert month and year into a date range
        const startDate = new Date(`${year}-${month}-01T00:00:00Z`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0); // Set to last day of the month

        // Delete sessions within the specified month
        const deletedSessions = await prisma.workSessions.deleteMany({
            where: {
                endTime: {
                    gte: startDate,
                    lte: endDate,
                },
                active:false,
            },
        });

        res.status(200).json({
            message: 'Sessions deleted successfully',
            deletedCount: deletedSessions.count,
        });
    } catch (error) {
        console.error('Error deleting sessions by month:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getWorkSessionsUser = async (req: Request, res: Response): Promise<void> => {
    const { user_id } = req.params;

    try {
        // Pobierz wszystkie sesje pracy dla użytkownika
        const workSessions = await prisma.workSessions.findMany({
            where: { user_id: Number(user_id), 
                    active:false,
            },
            include: {
                User: {
                    include: {
                        UserRole: {
                            include: { Role: true }
                        }
                    }
                }
            }
        });

        res.json(workSessions);
    } catch (error) {
        console.error('Error fetching work sessions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const endSessionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const sessionId = parseInt(req.params.session_id, 10); // Pobierz session_id z parametrów URL

        if (isNaN(sessionId)) {
            res.status(400).json({ message: 'Invalid session_id' });
            return;
        }

        // Znajdź sesję na podstawie session_id
        const session = await prisma.workSessions.findUnique({
            where: { session_id: sessionId }
        });

        if (session && session.active) {
            // Zaktualizuj sesję, kończąc ją
            await prisma.workSessions.update({
                where: { session_id: sessionId },
                data: {
                    endTime: new Date(),
                    active: false,
                },
            });
            res.json({ message: 'Session ended successfully.' });
        } else {
            res.status(404).json({ message: 'Session not found or already ended.' });
        }
    } catch (error) {
        console.error('Error ending session:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};