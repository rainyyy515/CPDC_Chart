using CPDC_Chart.Dto;
using CPDC_Chart.Interface;
using Dapper;
using System.Data.SqlClient;

namespace CPDC_Chart.Services
{
    public class DataService : IDataService
    {
        private readonly string _connectString;

        public DataService(string connectString)
        {
            _connectString = connectString;
        }

        public IEnumerable<dynamic> GetQueryData(QueryDto query)
        {
            try
            {
                using var conn = new SqlConnection(_connectString);
                var paramters = new DynamicParameters();
                paramters.Add("@StartTime", query.StartTime);
                paramters.Add("@EndTime", query.EndTime);
                var checkboxStr = string.Empty;
                for (int i = 0; i < query.CheckboxValues!.Count; i++)
                {
                    checkboxStr += $",[{query.CheckboxValues![i]}] as '{query.CheckboxStrings![i]}'";
                }
                var sql = @$"SELECT
                    a.[RecDateTime]
                    {checkboxStr}
                    FROM [CPDCII].[dbo].[AVG_{query.Model}] as a
                    INNER JOIN [CPDCII].[dbo].[Temporary_{query.Model}] as b
                    ON a.RecDateTime = b.RecDateTime
                    WHERE a.RecDateTime BETWEEN @StartTime AND @EndTime
                    ORDER BY RecDateTime";

                var result = conn.Query<dynamic>(sql, paramters);
                return result;
            }
            catch (SqlException ex)
            {
                Console.WriteLine($"Error occurred while fetching data: {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An unexpected error occurred: {ex.Message}");
            }
            return [];
        }

        public IEnumerable<dynamic> GetQueryDataDay(QueryDto query)
        {
            try
            {
                using var conn = new SqlConnection(_connectString);
                var paramters = new DynamicParameters();
                paramters.Add("@StartTime", query.StartTime);
                paramters.Add("@EndTime", query.EndTime);
                var checkboxStr = string.Empty;
                for (int i = 0; i < query.CheckboxValues!.Count; i++)
                {
                    checkboxStr += $",AVG([{query.CheckboxValues![i]}]) as '{query.CheckboxStrings![i]}'";
                }
                var sql = @$"SELECT
                    CONVERT(date, a.[RecDateTime]) as RecDateTime
                    {checkboxStr}
                    FROM [CPDCII].[dbo].[AVG_T60] as a
                    LEFT JOIN [CPDCII].[dbo].[Temporary_T60] as b
                    ON a.RecDateTime = b.RecDateTime
                    WHERE a.RecDateTime BETWEEN @StartTime AND @EndTime
                    GROUP BY CONVERT(date, a.[RecDateTime])
                    ORDER BY RecDateTime";

                var result = conn.Query<dynamic>(sql, paramters);

                return result;
            }
            catch (SqlException ex)
            {
                Console.WriteLine($"Error occurred while fetching data: {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An unexpected error occurred: {ex.Message}");
            }
            return [];
        }
    }
}
