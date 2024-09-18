namespace CPDC_Chart.Dto
{
    public class QueryDto
    {
        public string? Model { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public List<string>? CheckboxValues { get; set; }
        public List<string>? CheckboxStrings { get; set; }
    }
}
