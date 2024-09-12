using CPDC_Chart.Dto;
using CPDC_Chart.Models;

namespace CPDC_Chart.Interface
{
    public interface IDataService
    {
        IEnumerable<dynamic> GetQueryData(QueryDto query);
        IEnumerable<dynamic> GetQueryDataDay(QueryDto query);
    }
}
