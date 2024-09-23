using CPDC_Chart.Dto;
using CPDC_Chart.Interface;
using Microsoft.AspNetCore.Mvc;

namespace CPDC_Chart.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CpdcApiController : ControllerBase
    {
        private readonly IDataService _dataService;

        public CpdcApiController(IDataService dataService)
        {
            _dataService = dataService;
        }
        [HttpPost]
        public IEnumerable<dynamic> Post(QueryDto query)
        {
            return _dataService.GetQueryData(query);
        }
        [HttpPost]
        [Route("Day")]
        public IEnumerable<dynamic> PostDay(QueryDto query)
        {
            return _dataService.GetQueryDataDay(query);
        }
        [HttpPost]
        [Route("DailyFR")]
        public IEnumerable<dynamic> PostDailyFR(QueryDto query)
        {
            return _dataService.GetQueryDataDailyFR(query);
        }
    }
}
