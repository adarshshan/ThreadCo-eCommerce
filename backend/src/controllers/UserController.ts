import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { DatabaseError, NotFoundError } from "../utils/errors";

export class UserController {
  constructor(private userService: UserService) {}

  async userLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: { email: string; password: string } = req.body;
      const loginStatus = await this.userService.userLogin(email, password); //This would return authResponse or throws error

      const accessTokenMaxAge = 5 * 60 * 1000;
      const refreshTokenMaxAge = 48 * 60 * 60 * 1000;

      res
        .status(loginStatus.status)
        .cookie("access_token", loginStatus.data.token, {
          maxAge: accessTokenMaxAge,
          sameSite: "none",
          secure: true,
        })
        .cookie("refresh_token", loginStatus.data.refreshToken, {
          maxAge: refreshTokenMaxAge,
          sameSite: "none",
          secure: true,
        })
        .json(loginStatus);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(401).json({
          success: false,
          message: "Authentication failed: User not found.",
        });
      } else if (error instanceof DatabaseError) {
        res.status(500).json({
          success: false,
          message: "Internal server error during login.",
        });
      } else if (error instanceof Error) {
        res.status(401).json({
          success: false,
          message: error.message || "Authentication failed.",
        });
      } else {
        res
          .status(500)
          .json({ success: false, message: "An unexpected error occurred." });
      }
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error creating user" });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error updating user" });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const success = await this.userService.deleteUser(req.params.id);
      if (!success) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting user" });
    }
  }

  async blockUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.blockUser(req.params.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error blocking user" });
    }
  }

  async unblockUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.unblockUser(req.params.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error unblocking user" });
    }
  }
}
