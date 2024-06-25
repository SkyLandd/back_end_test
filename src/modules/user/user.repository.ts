import { RegisterUserDto } from "@common/dtos/user.dto";
import { UserEntity } from "@database/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>
  ) { }

  public async exists(registerDto: RegisterUserDto) {
    const qb = this.userRepo.createQueryBuilder('user');
    qb.where(`user.email = :email`, { email: registerDto.email })
    qb.orWhere(`user.handle = :handle`, { handle: registerDto.handle });

    return qb.getExists();
  }

  public async findOneBy(filter: { id?: string, email?: string, handle?: string }) {
    const whereFilter: FindOptionsWhere<UserEntity> = {}
    if (filter.email) {
      whereFilter.email = filter.email;
    } else if (filter.handle) {
      whereFilter.handle = filter.handle;
    } else if (filter.id) {
      whereFilter.id = filter.id;
    }

    return this.userRepo.findOne({ where: whereFilter })
  }

  public async saveOne(userEntity: UserEntity) {
    return this.userRepo.save(userEntity);
  }
}