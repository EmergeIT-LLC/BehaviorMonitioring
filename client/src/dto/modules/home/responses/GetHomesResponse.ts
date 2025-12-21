import type { Home } from '../../../common/entities/Home';
import type { BaseResponse } from '../../../common';

export interface GetHomesResponse extends BaseResponse {
    homes: Home[];
    totalCount: number;
}
