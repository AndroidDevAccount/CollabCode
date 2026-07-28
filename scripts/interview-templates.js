(function() {
  window.InterviewTemplates = {
    'csharp-warmup': {
      language: 'csharp',
      content: `// C# warm-up — total the valid policy premiums
//
// Complete CalculateTotalPremium.
//
// Rules:
// 1. Add each positive premium to the total.
// 2. Ignore zero and negative values.
// 3. Return the total.
//
// Example:
// CalculateTotalPremium(new decimal[] { 100m, 50m, -10m, 0m })
// should return 150m.

using System;

public class Program
{
    public static decimal CalculateTotalPremium(decimal[] premiums)
    {
        // Write your code here.
        return 0m;
    }

    public static void Main()
    {
        Console.WriteLine(CalculateTotalPremium(
            new decimal[] { 100m, 50m, -10m, 0m })); // Expected: 150

        Console.WriteLine(CalculateTotalPremium(
            new decimal[] { 25.50m, 74.50m }));      // Expected: 100

        Console.WriteLine(CalculateTotalPremium(
            new decimal[] { -5m, 0m }));             // Expected: 0
    }
}

// If you finish early:
// - What should the method do if premiums is null?
// - Can you write the same logic using LINQ?`
    },

    'csharp-rest-api': {
      language: 'csharp',
      content: `// Third-party REST API integration (C#)
//
// Scenario:
// An ASP.NET application sends a document to a third-party extraction API.
// POST /documents returns JSON like:
// { "id": "doc-123", "status": "processed", "policyNumber": "P-1001" }
//
// Implement ExtractPolicyAsync. Discuss your choices as you work.
//
// Requirements:
// 1. Use the injected HttpClient; do not create a new HttpClient per request.
// 2. Send document bytes as multipart/form-data.
// 3. Deserialize a successful JSON response.
// 4. Handle non-success status codes, timeouts, and malformed JSON.
// 5. Pass the CancellationToken through.
// 6. Explain what you would log and which failures you would retry.

using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

public record ExtractionResult(string Id, string Status, string PolicyNumber);

public sealed class DocumentExtractionClient
{
    private readonly HttpClient _httpClient;

    public DocumentExtractionClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<ExtractionResult> ExtractPolicyAsync(
        byte[] document,
        string fileName,
        CancellationToken cancellationToken)
    {
        // TODO: implement
        throw new NotImplementedException();
    }
}

// Follow-ups:
// - Where should the API key be stored?
// - How would you prevent duplicate submissions?
// - How would you test this without calling the real provider?`
    },

    'aspnet-mvc': {
      language: 'csharp',
      content: `// ASP.NET MVC controller design
//
// Implement the POST action below for creating an insurance policy.
//
// Requirements:
// 1. Reject invalid input using ModelState.
// 2. Never bind or trust CreatedByUserId from the browser.
// 3. Call the service asynchronously and pass the cancellation token.
// 4. Use the Post/Redirect/Get pattern after success.
// 5. Show a useful error without exposing internal exception details.

using System;
using System.ComponentModel.DataAnnotations;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

public sealed class CreatePolicyViewModel
{
    [Required]
    public string PolicyNumber { get; set; } = "";

    [Required]
    public string CustomerName { get; set; } = "";

    public DateTime EffectiveDate { get; set; }
}

public interface IPolicyService
{
    Task<int> CreateAsync(
        CreatePolicyViewModel model,
        string currentUserId,
        CancellationToken cancellationToken);
}

public sealed class PoliciesController : Controller
{
    private readonly IPolicyService _policyService;

    public PoliciesController(IPolicyService policyService)
    {
        _policyService = policyService;
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(
        CreatePolicyViewModel model,
        CancellationToken cancellationToken)
    {
        // TODO: implement
        throw new NotImplementedException();
    }
}

// Follow-ups:
// - Why use a view model instead of the EF entity?
// - What problem does ValidateAntiForgeryToken address?
// - Where should business validation live?`
    },

    'sql-policy-query': {
      language: 'sql',
      content: `-- SQL Server query exercise
--
-- Tables:
-- Customers(CustomerId int PK, Name nvarchar(100), IsActive bit)
-- Policies(PolicyId int PK, CustomerId int FK, PolicyNumber varchar(30),
--          Status varchar(20), EffectiveDate date)
-- Documents(DocumentId int PK, PolicyId int FK, ProcessedAt datetime2,
--           ExtractionStatus varchar(20))
--
-- Write one query returning each active customer who has an Active policy:
--   CustomerId
--   CustomerName
--   PolicyNumber
--   EffectiveDate
--   SuccessfulDocumentCount
--   LastSuccessfulDocumentAt
--
-- Include active policies even when they have no successfully processed
-- documents. Sort newest policies first.

-- Write your query here:


-- Follow-ups:
-- 1. Why is LEFT JOIN useful here?
-- 2. Which indexes would you consider?
-- 3. What changes if a customer can have several active policies?
-- 4. How would you safely filter EffectiveDate using an input parameter?`
    },

    'ef-linq': {
      language: 'csharp',
      content: `// Entity Framework Core + LINQ
//
// Implement GetEmployeesAsync.
//
// Requirements:
// 1. Return only active employees in the requested department.
// 2. Search first name, last name, or email when search is not blank.
// 3. Sort by last name and then first name.
// 4. Return only the requested page.
// 5. Project directly to EmployeeSummary; do not load full entities.
// 6. This is read-only.

using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

public record EmployeeSummary(int Id, string FullName, string Email);

public async Task<List<EmployeeSummary>> GetEmployeesAsync(
    AppDbContext db,
    int departmentId,
    string? search,
    int page,
    int pageSize,
    CancellationToken cancellationToken)
{
    // TODO: implement with EF Core and LINQ
    throw new System.NotImplementedException();
}

// Follow-ups:
// - What does AsNoTracking change?
// - Why project before ToListAsync?
// - What SQL do you expect EF Core to generate?
// - How would you prevent unreasonable page sizes?`
    },

    'solid-refactor': {
      language: 'csharp',
      content: `// SOLID refactoring exercise
//
// Review this class. Identify concrete design/testability problems, then
// refactor it. You do not need to write infrastructure implementations.

using System;
using System.Data.SqlClient;
using System.Net.Mail;

public sealed class PolicyProcessor
{
    public void Process(int policyId)
    {
        using var connection =
            new SqlConnection("Server=prod;Database=Insurance;User Id=admin;Password=secret");
        connection.Open();

        var command = new SqlCommand(
            "UPDATE Policies SET Status='Verified' WHERE PolicyId=" + policyId,
            connection);
        command.ExecuteNonQuery();

        new SmtpClient("smtp.company.com")
            .Send("system@company.com", "manager@company.com",
                  "Policy verified", policyId.ToString());

        Console.WriteLine("Processed policy " + policyId);
    }
}

// Discuss:
// 1. Which SOLID principles are under pressure here?
// 2. How would dependency injection improve the design?
// 3. How should the SQL and configuration be corrected?
// 4. What should happen if the email fails after the database update?
// 5. Show at least two focused interfaces and a refactored processor.`
    },

    'csharp-debugging': {
      language: 'csharp',
      content: `// C# debugging and reliability
//
// This method sometimes returns incomplete results and occasionally hides
// production failures. Find the problems and rewrite it.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public async Task<List<Policy>> LoadPoliciesAsync(IEnumerable<int> ids)
{
    var policies = new List<Policy>();

    ids.ToList().ForEach(async id =>
    {
        try
        {
            var policy = await _repository.GetByIdAsync(id);
            if (policy != null)
                policies.Add(policy);
        }
        catch (Exception)
        {
            // Ignore failures
        }
    });

    return policies;
}

// Follow-ups:
// - Why does async inside List.ForEach cause trouble?
// - Is List<T> safe for concurrent writes?
// - When would Task.WhenAll be appropriate?
// - How should cancellation, logging, and partial failure be handled?`
    },

    'dotnet-interview-plan': {
      language: 'markdown',
      content: `# Junior .NET Interview — 55-minute plan

## 1. Very simple coding warm-up (5 minutes)
Load: **C# — Very Simple Warm-up**

Look for:
- a working loop and condition
- correct decimal total
- ability to run and check the examples
- clear explanation of basic choices

This is an orientation exercise. Give help with the editor if needed and do not
overweight small syntax mistakes.

## 2. Experience walkthrough (8 minutes)
- Describe the insurance document workflow you built.
- What data went to the third-party API and what came back?
- Tell me about a production failure you diagnosed personally.
- What part did you implement yourself versus with team support?

## 3. REST integration exercise (15 minutes)
Load: **C# — Third-party REST API**

Look for:
- injected HttpClient and async/await
- cancellation and clear failure handling
- JSON deserialization and validation
- secrets kept outside source code
- reasonable retry/idempotency discussion

## 4. SQL Server exercise (12 minutes)
Load: **SQL Server — Policy Query**

Look for:
- correct INNER/LEFT JOIN choices
- GROUP BY and aggregates
- parameterization, not string concatenation
- practical index reasoning

## 5. EF Core / LINQ exercise (10 minutes)
Load: **Entity Framework + LINQ**

Look for:
- filtering before materialization
- projection, paging, AsNoTracking
- awareness that LINQ is translated to SQL

## 6. Design discussion (7 minutes)
Load: **SOLID — Refactoring**

Look for:
- specific responsibilities, not memorized definitions
- dependency injection and small interfaces
- transaction/failure-boundary reasoning

## 7. Candidate questions (3 minutes)

Calibration: this is a junior candidate. Prefer clear reasoning, safe defaults,
and ability to learn over perfect framework syntax. Ask for clarification and
give one hint before treating a stall as a negative signal.`
    }
  };
})();
