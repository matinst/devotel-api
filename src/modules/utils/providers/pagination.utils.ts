import { PaginationDto } from "../../../common/DTO/pagination.dto";

export function PaginationUtils(paginationData: PaginationDto) {
  const { limit = 10, page = 1 } = paginationData;

  //   const pageN = Number.parseInt(page) || 1;
  //   const limitN = Number.parseInt(limit) || 10;

  const skip = (page - 1) * limit;

  return {
    // page: page,
    // limit: limit > 50 ? 50 : limit,
    limit: limit,
    skip: skip,
  };
}
