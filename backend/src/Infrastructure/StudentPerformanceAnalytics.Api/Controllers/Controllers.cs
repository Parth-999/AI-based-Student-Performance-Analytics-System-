using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentPerformanceAnalytics.Application.DTOs;
using StudentPerformanceAnalytics.Application.Services;

namespace StudentPerformanceAnalytics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto request)
    {
        var response = await _authService.LoginAsync(request);
        return Ok(response);
    }
}

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly IStudentService _studentService;

    public StudentsController(IStudentService studentService)
    {
        _studentService = studentService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<StudentSummaryDto>>> GetStudents(
        [FromQuery] string? search,
        [FromQuery] string? department,
        [FromQuery] int? semester,
        [FromQuery] string? division,
        [FromQuery] string? riskLevel)
    {
        var result = await _studentService.GetStudentsAsync(search, department, semester, division, riskLevel);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<StudentDetailDto>> GetStudentById(Guid id)
    {
        var student = await _studentService.GetStudentByIdAsync(id);
        if (student == null) return NotFound(new { message = "Student not found." });
        return Ok(student);
    }

    [HttpPost]
    public async Task<ActionResult<StudentSummaryDto>> CreateStudent([FromBody] CreateStudentDto dto)
    {
        var created = await _studentService.CreateStudentAsync(dto);
        return CreatedAtAction(nameof(GetStudentById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateStudent(Guid id, [FromBody] CreateStudentDto dto)
    {
        var success = await _studentService.UpdateStudentAsync(id, dto);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteStudent(Guid id)
    {
        var success = await _studentService.DeleteStudentAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}

[ApiController]
[Route("api/[controller]")]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceService _attendanceService;

    public AttendanceController(IAttendanceService attendanceService)
    {
        _attendanceService = attendanceService;
    }

    [HttpGet("daily")]
    public async Task<ActionResult<IEnumerable<AttendanceRecordDto>>> GetDailyAttendance(
        [FromQuery] string department = "Computer Science",
        [FromQuery] string subject = "Machine Learning",
        [FromQuery] DateTime? date = null)
    {
        var targetDate = date ?? DateTime.UtcNow.Date;
        var result = await _attendanceService.GetDailyAttendanceAsync(department, subject, targetDate);
        return Ok(result);
    }

    [HttpPost("batch-mark")]
    public async Task<IActionResult> BatchMark([FromBody] BatchMarkAttendanceDto dto)
    {
        await _attendanceService.BatchMarkAttendanceAsync(dto);
        return Ok(new { message = "Attendance saved successfully." });
    }
}

[ApiController]
[Route("api/[controller]")]
public class MarksController : ControllerBase
{
    private readonly IMarksService _marksService;

    public MarksController(IMarksService marksService)
    {
        _marksService = marksService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SubjectMarkDto>>> GetAllMarks()
    {
        var marks = await _marksService.GetAllMarksAsync();
        return Ok(marks);
    }

    [HttpGet("student/{studentId:guid}")]
    public async Task<ActionResult<IEnumerable<SubjectMarkDto>>> GetStudentMarks(Guid studentId)
    {
        var marks = await _marksService.GetStudentMarksAsync(studentId);
        return Ok(marks);
    }

    [HttpPost("save")]
    public async Task<IActionResult> SaveMarks([FromBody] List<SaveStudentMarkDto> marksList)
    {
        await _marksService.SaveMarksAsync(marksList);
        return Ok(new { message = "Evaluation marks saved successfully." });
    }

    [HttpPost("calculate-grades")]
    public async Task<IActionResult> AutoCalculateGrades()
    {
        await _marksService.AutoCalculateGradesAsync();
        return Ok(new { message = "Automated grade weighting complete." });
    }
}

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;

    public AnalyticsController(IAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    [HttpGet("powerbi-summary")]
    public async Task<ActionResult<PowerBiSummaryDto>> GetPowerBiSummary()
    {
        var summary = await _analyticsService.GetPowerBiSummaryAsync();
        return Ok(summary);
    }
}

[ApiController]
[Route("api/[controller]")]
public class PredictionsController : ControllerBase
{
    private readonly IPredictionService _predictionService;

    public PredictionsController(IPredictionService predictionService)
    {
        _predictionService = predictionService;
    }

    [HttpGet]
    public async Task<ActionResult<AiPredictionSummaryDto>> GetPredictions()
    {
        var summary = await _predictionService.GetPredictionSummaryAsync();
        return Ok(summary);
    }

    [HttpPost("run-inference")]
    public async Task<IActionResult> RunInference()
    {
        await _predictionService.RunInferenceAsync();
        return Ok(new { message = "Flask Machine Learning model inference complete." });
    }
}
[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IReportsService _reportsService;

    public ReportsController(IReportsService reportsService)
    {
        _reportsService = reportsService;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<ReportsDashboardDto>> GetDashboard()
    {
        var result = await _reportsService.GetDashboardAsync();
        return Ok(result);
    }
}

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly ISettingsService _settingsService;

    public SettingsController(ISettingsService settingsService)
    {
        _settingsService = settingsService;
    }

    [HttpGet]
    public async Task<ActionResult<SystemSettingDto>> GetSettings()
    {
        return Ok(await _settingsService.GetSettingsAsync());
    }

    [HttpPost]
    public async Task<IActionResult> UpdateSettings([FromBody] SystemSettingDto dto)
    {
        var success = await _settingsService.UpdateSettingsAsync(dto);

        if (!success)
            return NotFound();

        return Ok(new
        {
            success = true,
            message = "Institutional settings saved successfully."
        });
    }
}
