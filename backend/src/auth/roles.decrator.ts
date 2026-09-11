import {
    SetMetadata,
} from '@nestjs/common';

import {
    Role,
} from '../common/enums/role.enum';

export const roles = (
    ...allowedRoles: Role[]
) =>
    SetMetadata(
        'roles',
        allowedRoles,
    );