import { Injectable } from "@nestjs/common";
@Injectable()
export class SalaryService {
  async parseSalary(salaryRange: string): Promise<{ min: number; max: number }> {
    const salaryMatch = salaryRange.match(/\$(\d+)(k?)(\s*-\s*\$?(\d+)?(k?)?)/);

    if (salaryMatch) {
      const minSalary = parseInt(salaryMatch[1]) * (salaryMatch[2] === "k" ? 1000 : 1);
      const maxSalary = salaryMatch[4] ? parseInt(salaryMatch[4]) * (salaryMatch[5] === "k" ? 1000 : 1) : minSalary;

      return {
        min: minSalary,
        max: maxSalary,
      };
    }

    return {
      min: 0,
      max: 0,
    };
  }
}
