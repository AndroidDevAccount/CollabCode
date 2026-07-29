'use strict';

module.exports = {
    'csharp-warmup': {
      title: 'C# Warm-up — Discounted Premiums',
      language: 'csharp',
      content: `// 5-minute C# warm-up
//
// We are starting a small insurance application.
//
// A Policy stores an array because its premium can change each month.
// Complete CalculateDiscountedPremiumTotal:
// - Ignore monthly premiums that are zero or negative.
// - Give each valid monthly premium a 10% discount.
// - Return the total after the discounts.
//
// Example:
// Monthly premiums: { 100.00, 120.00, 0.00, -20.00 }
// Discounted values:  { 90.00, 108.00 }
// Expected total:     198.00

using System;

public class Policy
{
    public double[] MonthlyPremiums { get; set; }

    public Policy(double[] monthlyPremiums)
    {
        MonthlyPremiums = monthlyPremiums;
    }

    public double CalculateDiscountedPremiumTotal()
    {
        double total = 0;

        // Write your loop and filter here.

        return total;
    }
}

public class Program
{
    public static void Main()
    {
        var policy = new Policy(
            new double[] { 100.00, 120.00, 0.00, -20.00 });

        Console.WriteLine(
            policy.CalculateDiscountedPremiumTotal()); // Expected: 198.00
    }
}`,
      answerKey: `PLAIN-ENGLISH ANSWER
Loop through the policy's MonthlyPremiums. Skip zero and negative values. For
each valid premium, keep 90% of it by multiplying by 0.90, then add that
discounted value to the total.

ONE GOOD SOLUTION
public double CalculateDiscountedPremiumTotal()
{
    double total = 0;

    foreach (double premium in MonthlyPremiums)
    {
        if (premium > 0)
        {
            total += premium * 0.90;
        }
    }

    return total;
}

HOW TO GRADE (0–3)
3 — Loops through the array, includes only positive premiums, applies the 10%
    discount, and returns 198.00.
2 — Correct loop and filter but misses or slightly miscalculates the discount,
    or has one small syntax mistake.
1 — Can explain the filter or discount but cannot combine them in the loop.
0 — Does not iterate through the monthly premiums or cannot identify the rules.

ALSO CORRECT WITH LINQ
return MonthlyPremiums
    .Where(premium => premium > 0)
    .Sum(premium => premium * 0.90);

Do not require LINQ, rounding, null handling, or exactly 12 array entries. The
point is to warm up with an object, an array, a filter, and simple arithmetic
before expanding the insurance model in the next question.`
    },

    'csharp-rest-api': {
      title: 'C# Public REST API Test',
      language: 'csharp',
      content: `// 5-minute REST API question
//
// We are using JSONPlaceholder, a free API made for testing.
//
// Documentation:
// https://jsonplaceholder.typicode.com/
//
// Request:
// GET https://jsonplaceholder.typicode.com/todos/1
//
// Expected response shape:
// {
//   "userId": 1,
//   "id": 1,
//   "title": "delectus aut autem",
//   "completed": false
// }
//
// Task: Complete GetTodoAsync using exactly these steps:
// 1. Send a GET request to "todos/1".
// 2. Throw an error if the response is not successful.
// 3. Read and return the response body as text.
//
// Before coding, open this URL in a browser to confirm the API is available:
// https://jsonplaceholder.typicode.com/todos/1
//
// The interview editor's hosted C# runner might not allow outbound HTTP.
// Grade the method itself and ask the candidate to explain each line.

using System;
using System.Net.Http;
using System.Threading.Tasks;

public class TodoClient
{
    private readonly HttpClient _client;

    public TodoClient(HttpClient client)
    {
        _client = client;
    }

    public async Task<string> GetTodoAsync()
    {
        // Write 3 lines here.
        return "";
    }
}

public class Program
{
    public static void Main()
    {
        RunAsync().GetAwaiter().GetResult();
    }

    private static async Task RunAsync()
    {
        using (var httpClient = new HttpClient
        {
            BaseAddress = new Uri("https://jsonplaceholder.typicode.com/")
        })
        {
            var todoClient = new TodoClient(httpClient);
            string json = await todoClient.GetTodoAsync();
            Console.WriteLine(json);
        }
    }
}`,
      answerKey: `PLAIN-ENGLISH ANSWER
Use the provided HttpClient to send a GET request. Check that the server
returned success. Then read and return the response text.

ONE GOOD SOLUTION
var response = await _client.GetAsync("todos/1");
response.EnsureSuccessStatusCode();
return await response.Content.ReadAsStringAsync();

WHAT EACH LINE DOES
1. GetAsync sends an HTTP GET and waits for the real server response.
2. EnsureSuccessStatusCode throws if the server returns 4xx or 5xx.
3. ReadAsStringAsync reads the JSON response body into a string.

EXPECTED RESULT
Opening the endpoint in a browser should show JSON containing:
- "id": 1
- "title": "delectus aut autem"
- "completed": false

HOW TO GRADE (0–3)
3 — Writes all three lines correctly and can explain request, status, and body.
2 — Gets and returns the response but misses the status check or needs a hint.
1 — Knows an HTTP GET is needed but cannot form the method.
0 — Creates unrelated code or cannot explain request versus response.

BONUS DISCUSSION (do not require)
- API keys belong in configuration, not source code.
- Production code should accept a CancellationToken.
- JSON would normally be deserialized into a C# Todo model.
- HttpClient should usually be injected rather than recreated per request.`
    },

    'aspnet-mvc': {
      title: 'ASP.NET MVC — Form Validation',
      language: 'csharp',
      content: `// 5-minute ASP.NET MVC question
//
// The Razor page below submits a Policy Number to this controller.
// A browser's "required" check can be bypassed, so the controller must
// also reject a blank PolicyNumber.
//
// Complete the two TODOs:
// 1. Add a validation attribute to PolicyNumber so it is required.
// 2. In the controller, show the form again when validation failed.

// Create.cshtml (frontend)
// -----------------------
// @model PolicyViewModel
//
// <form asp-action="Create" method="post">
//     <label asp-for="PolicyNumber"></label>
//     <input asp-for="PolicyNumber" required />
//     <span asp-validation-for="PolicyNumber"></span>
//     <button type="submit">Save</button>
// </form>

using System;
using System.Threading.Tasks;

public class PolicyViewModel
{
    // TODO 1: Make this required with the message:
    // "Policy number is required."
    public string PolicyNumber { get; set; } = "";
}

public class PolicyController : Controller
{
    private readonly PolicyService _policyService = new PolicyService();

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(PolicyViewModel model)
    {
        // TODO 2: If ModelState is invalid, return View(model).

        await _policyService.CreateAsync(model);
        return RedirectToAction("Index");
    }
}

public class Program
{
    public static void Main()
    {
        RunAsync().GetAwaiter().GetResult();
    }

    private static async Task RunAsync()
    {
        var controller = new PolicyController();
        controller.ModelState.IsValid = false; // Simulates a blank form.

        IActionResult result =
            await controller.Create(new PolicyViewModel());

        Console.WriteLine(result.Name); // Expected after fix: View
    }
}

// RUNNER SUPPORT
// These small stand-ins let this MVC exercise run without a complete web
// project. In a real ASP.NET Core app these types come from the MVC framework.
public class HttpPostAttribute : Attribute { }
public class ValidateAntiForgeryTokenAttribute : Attribute { }

public class RequiredAttribute : Attribute
{
    public string ErrorMessage { get; set; }
}

public class IActionResult
{
    public string Name { get; set; }
}

public class ModelStateDictionary
{
    public bool IsValid { get; set; }
}

public class Controller
{
    public ModelStateDictionary ModelState { get; } =
        new ModelStateDictionary { IsValid = true };

    protected IActionResult View(object model)
    {
        return new IActionResult { Name = "View" };
    }

    protected IActionResult RedirectToAction(string action)
    {
        return new IActionResult { Name = "Redirect:" + action };
    }
}

public class PolicyService
{
    public Task CreateAsync(PolicyViewModel model)
    {
        return Task.FromResult(0);
    }
}`,
      answerKey: `PLAIN-ENGLISH ANSWER
The HTML "required" attribute helps the user, but it is not security: a request
can skip the browser. In MVC, a normal required-field rule belongs on the view
model as a [Required] data annotation. Model binding runs that validation on the
server and adds any failure to ModelState. The controller returns the same view
when ModelState is invalid, and <span asp-validation-for="PolicyNumber">
displays the field's error message.

ONE GOOD SOLUTION
[Required(ErrorMessage = "Policy number is required.")]
public string PolicyNumber { get; set; } = "";

if (!ModelState.IsValid)
{
    return View(model);
}

await _policyService.CreateAsync(model);
return RedirectToAction("Index");

HOW TO GRADE (0-3)
3 — Adds [Required], returns View(model) when ModelState is invalid, and saves
    only valid input.
2 — Uses the correct validation pattern with a small syntax mistake, missing
    custom message, or returns View() without preserving the model.
1 — Understands that the server must validate, but cannot implement both TODOs.
0 — Relies only on HTML "required" or still saves a blank PolicyNumber.

WHAT TO LISTEN FOR
- The browser check improves usability; server validation protects the app.
- Returning View(model) preserves what the user typed and shows the error.
- Redirecting after success helps prevent an accidental duplicate form post.

WHEN ModelState.AddModelError IS APPROPRIATE
Manual errors are still useful for rules that a simple attribute cannot express,
such as "this policy number already exists" after checking the database:

ModelState.AddModelError(
    nameof(model.PolicyNumber),
    "That policy number already exists.");

WEB FORMS NOTE
Setting an error label or using validator controls is familiar in ASP.NET Web
Forms. In ASP.NET MVC, validation attributes + ModelState +
asp-validation-for are the conventional equivalent.`
    },

    'sql-policy-query': {
      title: 'SQL Server Simple Join',
      language: 'sql',
      content: `-- 5-minute SQL Server question
--
-- TABLES
--
-- Customers
-- +------------+---------------+
-- | CustomerId | Name          |
-- +------------+---------------+
-- | 1          | Alice Johnson |
-- | 2          | Bob Smith     |
-- | 3          | Carla Gomez   |
-- +------------+---------------+
--
-- Policies
-- +----------+------------+--------------+-----------+
-- | PolicyId | CustomerId | PolicyNumber | Status    |
-- +----------+------------+--------------+-----------+
-- | 101      | 1          | AUTO-1001    | Active    |
-- | 102      | 1          | HOME-2001    | Cancelled |
-- | 103      | 2          | AUTO-1002    | Active    |
-- | 104      | 3          | LIFE-3001    | Pending   |
-- +----------+------------+--------------+-----------+
--
-- CustomerId connects each policy to its customer. For example,
-- policy AUTO-1001 has CustomerId 1, so it belongs to Alice Johnson.
--
-- TASK
-- Return the customer name and policy number for Active policies only.
--
-- EXPECTED RESULT
-- +---------------+--------------+
-- | Name          | PolicyNumber |
-- +---------------+--------------+
-- | Alice Johnson | AUTO-1001    |
-- | Bob Smith     | AUTO-1002    |
-- +---------------+--------------+

SELECT
    -- Write the two columns here
FROM Customers c
    -- Add the JOIN to Policies here
WHERE
    -- Keep only Active policies here
;`,
      answerKey: `PLAIN-ENGLISH ANSWER
Select Name from Customers and PolicyNumber from Policies. Join the tables
where their CustomerId values match. Filter Status to Active.

ONE GOOD SOLUTION
SELECT
    c.Name,
    p.PolicyNumber
FROM Customers c
INNER JOIN Policies p ON p.CustomerId = c.CustomerId
WHERE p.Status = 'Active';

HOW TO GRADE (0–3)
3 — Correct columns, JOIN condition, and Active filter.
2 — Right structure with one minor alias or syntax error.
1 — Can explain matching CustomerId but cannot write the JOIN.
0 — No relationship between the tables or uses unrelated columns.

Important: INNER JOIN or JOIN are both correct here.`
    },

    'ef-linq': {
      title: 'LINQ Simple Filter',
      language: 'csharp',
      content: `// 5-minute LINQ question
//
// Each Employee object has these fields:
// - Id: the employee's unique number
// - Name: the employee's full name
// - Department: the team where the employee works
// - IsActive: true if the employee currently works for the company
//
// SAMPLE DATA
// Id | Name          | Department | IsActive
// 1  | Carla Gomez   | Claims     | true
// 2  | Bob Smith     | Sales      | false
// 3  | Alice Johnson | Claims     | true
//
// Complete the query so it returns the names of active employees,
// sorted alphabetically.
//
// EXPECTED RESULT
// Alice Johnson
// Carla Gomez

using System;
using System.Collections.Generic;
using System.Linq;

public class Employee
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Department { get; set; } = "";
    public bool IsActive { get; set; }
}

public class Program
{
    public static void Main()
    {
        var employees = new List<Employee>
        {
            new Employee { Id = 1, Name = "Carla Gomez", Department = "Claims", IsActive = true },
            new Employee { Id = 2, Name = "Bob Smith", Department = "Sales", IsActive = false },
            new Employee { Id = 3, Name = "Alice Johnson", Department = "Claims", IsActive = true }
        };

        var names = employees
            // Filter IsActive == true
            // Sort by Name
            // Select Name
            .ToList();

        foreach (var name in names)
        {
            Console.WriteLine(name);
        }
    }
}`,
      answerKey: `PLAIN-ENGLISH ANSWER
Filter the list to active employees, sort those employees by name, and then
select just each employee's name. Bob is removed because IsActive is false.
Alice appears before Carla because OrderBy sorts the names alphabetically.

ONE GOOD SOLUTION
var names = employees
    .Where(e => e.IsActive)
    .OrderBy(e => e.Name)
    .Select(e => e.Name)
    .ToList();

HOW TO GRADE (0–3)
3 — Correct Where, OrderBy, Select, and ToList sequence.
2 — Gets two of the three operations or fixes the third with a hint.
1 — Understands filtering but cannot express a LINQ lambda.
0 — Cannot identify IsActive as the filter.

BONUS: With Entity Framework, this query is normally translated into SQL.`
    },

    'ef-migration': {
      title: 'Entity Framework — Add a Field',
      language: 'csharp',
      content: `// 5-minute Entity Framework Core question
//
// DAY-TO-DAY SCENARIO
// This Policy class already exists in a working application and its SQL Server
// table already contains policy records.
//
// The business now wants to store an optional renewal date. Old policies might
// not have a renewal date, so the new field must allow null.
//
// Complete these two tasks:
// 1. Add a nullable RenewalDate field to the Policy class.
// 2. Write the commands you would run to create and apply an EF Core migration.

using System;

public class Policy
{
    public int Id { get; set; }
    public string PolicyNumber { get; set; } = "";
    public string CustomerName { get; set; } = "";
    public decimal Premium { get; set; }

    // TODO 1: Add the nullable RenewalDate property here.
}

// TODO 2: Write the two EF Core commands as comments:
// Create migration:
// Apply migration:

public class Program
{
    public static void Main()
    {
        var policy = new Policy
        {
            Id = 101,
            PolicyNumber = "AUTO-1001",
            CustomerName = "Alice Johnson",
            Premium = 125.50m
        };

        Console.WriteLine(policy.PolicyNumber); // Expected: AUTO-1001
    }
}`,
      answerKey: `PLAIN-ENGLISH ANSWER
Entity Framework maps the Policy class to a database table. Changing the C#
class alone does not update the existing SQL Server table. A migration records
the required schema change, and the database-update command applies it.

The question says the date is optional. DateTime is a value type, so DateTime?
is used to allow null. Existing database rows can then have NULL in the new
RenewalDate column.

ONE GOOD MODEL CHANGE
public DateTime? RenewalDate { get; set; }

GOOD COMMANDS — .NET CLI
dotnet ef migrations add AddRenewalDateToPolicy
dotnet ef database update

ALSO CORRECT — VISUAL STUDIO PACKAGE MANAGER CONSOLE
Add-Migration AddRenewalDateToPolicy
Update-Database

The migration name is chosen by the developer; any clear name is acceptable.

HOW TO GRADE (0-3)
3 — Adds DateTime?, creates a migration, and applies it with correct commands.
2 — Correct nullable property and remembers migrations, but misses or slightly
    mistypes one command.
1 — Adds DateTime or DateTime? but does not know how the database is updated.
0 — Only edits SQL manually or cannot connect the model change to the database.

WHAT TO LISTEN FOR
- Nullable avoids inventing a date for existing policies.
- The generated migration should be reviewed before applying it.
- Production migrations should follow the team's deployment process; developers
  should not casually update a production database from their laptop.

DO NOT PENALIZE
Accept either the dotnet CLI or Package Manager Console command style.`
    },

    'csharp-unique-claims': {
      title: 'C# OOP — Remove Duplicate Claims',
      language: 'csharp',
      content: `// C# object-oriented coding question
//
// An import added duplicate Claim objects to a Policy. The Claims list is
// already sorted by Id, so duplicate IDs are next to each other.
//
// Complete RemoveDuplicateClaims:
// 1. Remove duplicate claims from the existing Claims list.
// 2. Keep the first Claim for each Id.
// 3. Preserve the original order.
// 4. Return the number of claims remaining.
//
// Example:
// Claim IDs before: { 100, 100, 205, 205, 310 }
// Claim IDs after:  { 100, 205, 310 }
// Return: 3

using System;
using System.Collections.Generic;

public class Claim
{
    public int Id { get; set; }
}

public class Policy
{
    public List<Claim> Claims { get; set; } = new List<Claim>();

    public int RemoveDuplicateClaims()
    {
        // Write your code here.
        return Claims.Count;
    }
}

public class Program
{
    private static int testsPassed = 0;
    private static int testsRun = 0;

    public static void Main()
    {
        RunTest("Mixed duplicates",
            new int[] { 100, 100, 205, 205, 310 },
            new int[] { 100, 205, 310 });
        RunTest("Empty list", new int[0], new int[0]);
        RunTest("One claim", new int[] { 700 }, new int[] { 700 });
        RunTest("All duplicates",
            new int[] { 42, 42, 42, 42 },
            new int[] { 42 });
        RunTest("Already unique",
            new int[] { 10, 20, 30, 40 },
            new int[] { 10, 20, 30, 40 });

        Console.WriteLine("SUMMARY: " + testsPassed + "/" + testsRun + " tests passed");
    }

    private static void RunTest(
        string name,
        int[] inputIds,
        int[] expectedIds)
    {
        testsRun++;
        var policy = new Policy();
        foreach (int id in inputIds)
        {
            policy.Claims.Add(new Claim { Id = id });
        }

        int remainingCount = policy.RemoveDuplicateClaims();
        bool passed =
            remainingCount == expectedIds.Length &&
            policy.Claims.Count == expectedIds.Length &&
            IdsMatch(policy.Claims, expectedIds);

        if (passed) testsPassed++;

        Console.WriteLine("TEST: " + name);
        Console.WriteLine("  Input IDs:      " + FormatIds(inputIds));
        Console.WriteLine("  Expected IDs:   " + FormatIds(expectedIds));
        Console.WriteLine("  Actual IDs:     " + FormatClaims(policy.Claims));
        Console.WriteLine("  Returned count: " + remainingCount);
        Console.WriteLine("  List.Count:     " + policy.Claims.Count);
        Console.WriteLine("  RESULT: " + (passed ? "PASS" : "FAIL"));
        Console.WriteLine();
    }

    private static bool IdsMatch(List<Claim> actual, int[] expected)
    {
        if (actual.Count != expected.Length) return false;
        for (int i = 0; i < expected.Length; i++)
        {
            if (actual[i].Id != expected[i]) return false;
        }
        return true;
    }

    private static string FormatClaims(List<Claim> claims)
    {
        int[] ids = new int[claims.Count];
        for (int i = 0; i < claims.Count; i++) ids[i] = claims[i].Id;
        return FormatIds(ids);
    }

    private static string FormatIds(int[] ids)
    {
        return "[" + string.Join(", ", ids) + "]";
    }
}`,
      answerKey: `PLAIN-ENGLISH ANSWER
Because the list is sorted, duplicate IDs are next to each other. Walk backward
through the list. When a claim has the same Id as the claim before it, remove
the later claim. Walking backward prevents a removal from causing the loop to
skip the next item.

ONE GOOD SOLUTION
public int RemoveDuplicateClaims()
{
    for (int i = Claims.Count - 1; i > 0; i--)
    {
        if (Claims[i].Id == Claims[i - 1].Id)
        {
            Claims.RemoveAt(i);
        }
    }

    return Claims.Count;
}

EXPECTED RESULT
The runner displays the IDs before and after, the returned count, the real
List.Count, and PASS or FAIL. A correct solution ends with:

SUMMARY: 5/5 tests passed

HOW TO GRADE (0-4)
4 — Removes duplicates from the existing list, keeps the first Claim, preserves
    order, returns the new Count, and passes all five cases.
3 — Correct approach with one small index or boundary mistake.
2 — Produces the right IDs by replacing the list with a new collection, or
    needs a hint to avoid skipping items after RemoveAt.
1 — Can find adjacent duplicates but cannot remove them safely.
0 — Cannot identify or remove duplicate Claim objects.

WHY LOOP BACKWARD?
RemoveAt shifts every later item one position to the left. A forward loop can
skip an item unless its index is adjusted. A backward loop only removes items
that the loop has already passed, so its remaining indexes stay valid.

Accept a careful forward loop or another clear in-place List solution.`
    },

    'csharp-debugging': {
      title: 'C# OOP — Model Customers and Policies',
      language: 'csharp',
      content: `// 5-minute C# object-oriented design question
//
// We are continuing the small insurance application from the warm-up.
// Right now, its information is written as one loose list:
//
// Customer ID: 1
// Customer name: Alice Johnson
// Customer email: alice@example.com
// Policy ID: 101
// Policy number: AUTO-1001
// Status: Active
// Premium: 125.50
//
// YOUR TASK
// Break this information into two C# classes: Customer and Policy.
//
// Customer should contain:
// - Id
// - Name
// - Email
//
// Policy should contain:
// - Id
// - PolicyNumber
// - Status
// - Premium
// - A Customer property connecting the policy to its owner
//
// Choose sensible C# types and create both classes below.

using System;

// Add your Customer and Policy classes here.

// This code runs after you create both classes. Do not change it.
public class Program
{
    public static void Main()
    {
        var customer = new Customer
        {
            Id = 1,
            Name = "Alice Johnson",
            Email = "alice@example.com"
        };

        var policy = new Policy
        {
            Id = 101,
            PolicyNumber = "AUTO-1001",
            Status = "Active",
            Premium = 125.50,
            Customer = customer
        };

        Console.WriteLine(policy.PolicyNumber);       // Expected: AUTO-1001
        Console.WriteLine(policy.Customer.Name);      // Expected: Alice Johnson
        Console.WriteLine(policy.Premium);            // Expected: 125.5
    }
}
`,
      answerKey: `PLAIN-ENGLISH ANSWER
The customer and policy are different concepts, so each gets its own class.
Policy refers to a Customer object instead of repeating the customer's name and
email. This relationship is called composition: one object contains or refers
to another object.

ONE GOOD SOLUTION
public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
}

public class Policy
{
    public int Id { get; set; }
    public string PolicyNumber { get; set; } = "";
    public string Status { get; set; } = "";
    public double Premium { get; set; }
    public Customer Customer { get; set; } = new Customer();
}

Keep the supplied Program class below these two classes. Press Run and expect:
AUTO-1001
Alice Johnson
125.5

WHY THESE TYPES?
- int is reasonable for the sample IDs.
- string fits names, email addresses, policy numbers, and the simple status.
- double keeps this short exercise consistent with the warm-up.
- Customer connects the two objects and keeps customer details together.

HOW TO GRADE (0-3)
3 — Creates both classes, places fields on the appropriate class, uses sensible
    types, and connects Policy to Customer.
2 — Creates both classes with most fields but misses the relationship or makes
    a small type/syntax mistake.
1 — Creates only one large class or needs substantial help separating the data.
0 — Cannot translate the described information into C# classes and properties.

ACCEPTABLE VARIATIONS
- Fields instead of properties are acceptable for this short exercise, although
  properties are conventional in C# application models.
- CustomerId on Policy is a reasonable database-oriented answer. Ask how the
  code would access the customer's name; adding Customer as well is stronger.
- An enum for Status is a good enhancement but is not required.
- Constructors are optional. Auto-properties are enough for full credit.

HOW THIS CONNECTS TO LATER QUESTIONS
The later SQL, MVC, Entity Framework, LINQ, and claims exercises build on these
same Customer and Policy ideas. The candidate does not need every production
field yet; this is only the starting model.`
    },

    'ai-prompting': {
      title: 'AI Prompting — Describe a .NET Change',
      language: 'markdown',
      content: `# 5-minute AI prompting question

## Scenario

You are working on an existing ASP.NET Core MVC insurance application that uses
Entity Framework Core and SQL Server.

The Policies Index page already lists every policy. The product owner asks you
to add a search box so users can find policies by customer name.

The requested behavior is:

- Add a customer-name search box to the existing Policies Index page.
- An empty search should show every policy.
- A non-empty search should show policies whose CustomerName contains the text.
- Filter in the database with Entity Framework rather than loading every row
  into memory first.
- Keep the user's search text visible in the box after submitting.
- Add tests for an empty search and a matching search.
- Do not change unrelated application behavior.

## Your task

Write the prompt you would give an AI coding assistant to implement this change.

There is no single exact answer. Your prompt should give the AI enough context
to make a useful change and explain how you would check its work.

Write your AI prompt below:

`,
      answerKey: `WHAT THIS QUESTION TESTS
This is not a test of finding magic words. A good developer treats an AI like a
new teammate: provide context, describe the desired behavior, set boundaries,
request verification, and review the result instead of trusting it blindly.

ONE STRONG EXAMPLE PROMPT
We have an existing ASP.NET Core MVC application using Entity Framework Core
and SQL Server. Please inspect the current Policy model, PoliciesController,
Policies/Index.cshtml view, DbContext, and existing test conventions before
editing anything.

Add customer-name search to the existing Policies Index page:
- Add a GET search input named customerName to the Razor view.
- Accept the optional value in the Index action.
- If it is blank, return all policies.
- Otherwise, filter by CustomerName in the IQueryable before ToListAsync so
  SQL Server performs the filtering.
- Preserve the entered value in the search box after submission.
- Follow the project's existing naming and styling patterns.
- Do not modify unrelated files or add a migration unless the model changes.
- Add tests for a blank search and a matching search.

Before editing, tell me which files you expect to change and ask about anything
the repository does not make clear. After editing, summarize the changes and
run the relevant build and tests. Show me any failures instead of hiding them.

WHY THIS IS STRONG
- It identifies the technology and asks the AI to inspect the real project.
- It translates the request into specific, observable behavior.
- It prevents an inefficient in-memory filter.
- It limits unrelated changes and unnecessary migrations.
- It asks for tests, build verification, and honest reporting of failures.

HOW TO GRADE (0-3)
3 — Includes project context, clear requirements, important constraints, and a
    request to test or verify the work.
2 — Describes the feature clearly but misses either technical context,
    boundaries, or verification.
1 — Gives a vague request such as "add search" with little useful detail.
0 — Provides no workable prompt or expects the AI output to be trusted without
    review.

GOOD FOLLOW-UP QUESTION
Ask: "What would you personally check before accepting the AI's code?"

Good answers include reviewing the diff, checking that filtering happens before
ToListAsync, running tests, trying empty and matching searches, checking error
handling, and confirming unrelated files were not changed.

INTERVIEWER TIP
Do not grade grammar or prompt length. A shorter prompt can earn full credit if
it communicates the context, desired outcome, constraints, and verification.`
    },

    'frontend-css': {
      title: 'HTML/CSS — Responsive Policy Card',
      language: 'html',
      content: `<!-- 5-minute HTML/CSS question

The HTML below displays a policy summary. The card needs a set width, some
breathing room around its content, and a visible border.

Update only the CSS to:
1. Make the card 400px wide.
2. Add 16px of space inside the card.
3. Add a 1px solid gray border.
4. Make the heading 24px, Arial, and bold.
5. Make the paragraphs Arial with normal font weight.
6. Give the button a blue background, white text, 10px vertical and 16px
   horizontal padding, no border, and bold Arial text.
7. Use an @media rule so that, when the screen is 480px wide or smaller, the
   policy card becomes 200px wide.
Bonus: In that same @media rule, make the button fill the card width.
-->

<style>
    /* Write all of your CSS here. */
</style>

<!-- Existing HTML — do not change -->
<article class="policy-card">
    <h2>Policy AUTO-1001</h2>
    <p>Customer: Alice Johnson</p>
    <p>Status: Active</p>
    <button class="details-button">View details</button>
</article>`,
      answerKey: `PLAIN-ENGLISH ANSWER
width sets the card's width. Padding adds space between the content and the
border. The h2 and p selectors style those element types inside the card. The
media query applies different styles when the screen is 480px wide or smaller.

ONE GOOD SOLUTION
.policy-card {
    width: 400px;
    padding: 16px;
    border: 1px solid gray;
}

.policy-card h2 {
    font-family: Arial, sans-serif;
    font-size: 24px;
    font-weight: bold;
}

.policy-card p {
    font-family: Arial, sans-serif;
    font-weight: normal;
}

.details-button {
    width: auto;
    padding: 10px 16px;
    border: none;
    background-color: blue;
    color: white;
    font-family: Arial, sans-serif;
    font-weight: bold;
}

@media (max-width: 480px) {
    .policy-card {
        width: 200px;
    }

    .details-button {
        width: 100%;
    }
}

HOW TO GRADE (0-3)
3 — Adds the card layout, requested heading and paragraph typography, button
    styling, and the 480px media rule that changes the card width to 200px.
2 — Completes most changes but misses one detail or makes a minor syntax error.
1 — Can add one or two basic properties but needs substantial help with the
    selectors or remaining styles.
0 — Does not know which CSS properties control these visible changes.

ACCEPTABLE VARIATIONS
- Colors such as #999, #ccc, or another reasonable gray are fine.
- A reasonable blue such as #0066cc, royalblue, or Bootstrap blue is fine.
- A close breakpoint such as 500px is fine if the candidate explains it.
- Equivalent selectors and reasonable pixel/rem values are fine.
- The full-width mobile button is a bonus and should not affect the main score.

OPTIONAL FOLLOW-UP
Ask the candidate to explain the difference between margin and padding:
padding is inside the element's border; margin is outside the border.`
    },

    'dotnet-interview-plan': {
      title: 'Introduction',
      language: 'markdown',
      content: `# Welcome to your .NET interview

You will work through ten short exercises. Each one is intended to take about
five minutes. The goal is to understand how you approach a problem—not to test
whether you have memorized every piece of syntax.

## What we will cover

1. C# — Discounted premium warm-up
2. C# — Model Customers and Policies
3. SQL Server — Simple Join
4. LINQ — Simple Filter
5. Entity Framework — Add a Field and Migration
6. ASP.NET MVC — Validation
7. C# — REST API Basics
8. AI — Prompt a Coding Assistant
9. HTML/CSS — Responsive Policy Card
10. C# — Remove Duplicate Claim IDs

## How to approach each exercise

- Read the prompt carefully and ask questions if anything is unclear.
- Talk through what you are thinking as you work.
- Write the clearest solution you can; small syntax mistakes are okay.
- You may write notes or pseudocode before writing the final code.
- If you get stuck, say where you are stuck. The interviewer may offer a hint.
- Explain your finished answer and how you would check that it works.

It is completely okay to say that you do not remember something. Clear
reasoning, honest communication, and learning from a hint are all valuable.`,
      answerKey: `OVERALL GRADING
Each exercise has a 0–3 score in its own Answer Key.

Suggested total for 10 questions: 30 points
27–30 — Strong performance
20–26 — Reasonable performance; discuss weak areas
12–19 — Significant gaps; consider experience claims carefully
0–11  — Fundamentals were not demonstrated

This is only a guide. Communication, honesty, response to hints, and ability
to explain their own resume should influence the final decision.

Good signs:
- Explains what they are doing.
- Tests the result instead of guessing.
- Accepts a hint and applies it.
- Says when they do not know something.

Warning signs:
- Cannot explain code they just wrote.
- Gives memorized terms without concrete meaning.
- Claims the editor is the problem before reading simple errors.
- Resume examples cannot be described in practical detail.`
    }
};
