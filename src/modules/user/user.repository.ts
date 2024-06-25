import { UserEntity } from "@database/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>
  ) { }

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