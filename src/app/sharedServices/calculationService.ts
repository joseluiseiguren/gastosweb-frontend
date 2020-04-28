export class CalculationService {

    public getIngresos(items: number[]): number {
        let ingresos = 0;

        if (!items) {
          return 0;
        }

        if (items.filter(x => x > 0).length > 0) {
          ingresos = items.filter(x => x > 0)
                                  .map(c => c)
                                  .reduce((sum, current) => sum + current);
        }

        return Math.abs(ingresos);
      }

      getEgresos(items: number[]): number {
        let egresos = 0;

        if (!items) {
          return 0;
        }

        if (items.filter(x => x < 0).length > 0) {
          egresos = items.filter(x => x < 0)
                                  .map(c => c)
                                  .reduce((sum, current) => sum + current);
        }

        return Math.abs(egresos);
      }
}
