using CPDC_Chart.Dto;

namespace CPDC_Chart.Interface
{
    public interface IDataService
    {
        IEnumerable<dynamic> GetQueryData(QueryDto query);
        IEnumerable<dynamic> GetQueryDataDay(QueryDto query);
        IEnumerable<dynamic> GetQueryDataDailyFR(QueryDto query);
    }
}
