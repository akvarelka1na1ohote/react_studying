namespace Notes_ver_001.Contracts;

public record GetNotesRequest(string? Search, string? SortItem, string? SortOrder);
