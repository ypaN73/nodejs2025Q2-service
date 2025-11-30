import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, users } from '../database/database';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto): Omit<User, 'password'> {
    const user: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    users.push(user);

    return this.excludePassword(user);
  }

  findAll(): Omit<User, 'password'>[] {
    return users.map((user) => this.excludePassword(user));
  }

  findOne(id: string): Omit<User, 'password'> {
    const user = users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.excludePassword(user);
  }

  update(id: string, updateUserDto: UpdateUserDto): Omit<User, 'password'> {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const user = users[userIndex];
    if (user.password !== updateUserDto.oldPassword) {
      throw new HttpException(
        'Old password is incorrect',
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedUser: User = {
      id: user.id,
      login: user.login,
      password: updateUserDto.newPassword,
      version: user.version + 1,
      createdAt: user.createdAt,
      updatedAt: Date.now(),
    };

    users[userIndex] = updatedUser;

    return this.excludePassword(updatedUser);
  }

  remove(id: string): void {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    users.splice(userIndex, 1);
  }

  private excludePassword(user: User): Omit<User, 'password'> {
    const userCopy = { ...user };
    delete (userCopy as { password?: string }).password;
    return userCopy as Omit<User, 'password'>;
  }
}
