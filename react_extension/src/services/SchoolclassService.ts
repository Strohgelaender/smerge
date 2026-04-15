import { getCurrentUser } from "./TeacherAuthService"
import httpService from "./HttpService";
import SchoolclassDto from "../components/models/SchoolclassDto";
import ProjectDto from "../components/models/ProjectDto";

const API_URL = "/api/";

export const getSchoolclassesOfCurrentUser = async () => {
    const result = await httpService.getAsync<SchoolclassDto[]>(API_URL + `teachers/${getCurrentUser().user_id}/schoolclasses`);
    return result ?? [];
}

export const getProjectsOfSchoolclass = async (schoolclass: SchoolclassDto) => {
    const result = await httpService.getAsync<ProjectDto[]>(API_URL + `schoolclasses/${schoolclass.id}/projects`).then((res) => {
        return res;}
    );
    return {schoolclass: schoolclass, projects: result};
}

export const getCommitCountForProject = async (projectId: string) => {
    const result = await httpService.getAsync<any[]>(API_URL + `project/${projectId}/files`);
    return result?.length ?? 0;
}

export const getLastCommitDateForProject = async (projectId: string) => {
    const result = await httpService.getAsync<any[]>(API_URL + `project/${projectId}/files`);
    if (!result || result.length === 0) return null;



    // Extract the most recent date from files
    // Try to get timestamp first (Unix timestamp in ms or s), then other date fields
    const dates = result
        .map((file: any) => {
            // Try timestamp field first
            if (file.timestamp) {
                // If timestamp is in seconds (10 digits), convert to ms
                const ts = file.timestamp.toString().length === 10 ? file.timestamp * 1000 : file.timestamp;
                return new Date(ts);
            }
            // Fall back to other date fields
            return file.updated_at || file.created_at || file.date ? new Date(file.updated_at || file.created_at || file.date) : null;
        })
        .filter((date: any) => date != null && !isNaN(date.getTime()));



    if (dates.length === 0) return null;
    const latestDate = new Date(Math.max(...dates.map(d => d.getTime())));

    return latestDate;
}

export const getKanbanCardCountForProject = (kanbanBoardJson: string, column: 'first' | 'last'): number => {
    try {
        const board = JSON.parse(kanbanBoardJson);
        if (!board?.columns || board.columns.length === 0) return 0;
        const targetColumn = column === 'first' ? board.columns[0] : board.columns[board.columns.length - 1];
        return targetColumn.cards?.length ?? 0;
    } catch {
        return 0;
    }
};

export const createSchoolclass = async (name: string) => {
    const result = await httpService.postAsync<SchoolclassDto>(API_URL + `schoolclasses`, {name: name, teacher_id: getCurrentUser().user_id});
    return result ?? null;
}

export const getProjectsForSchoolclasses = async (schoolclassesOfUser: SchoolclassDto[]) => {
    const temp: { schoolclass: SchoolclassDto; projects: ProjectDto[]; }[]= [];
    for (let index = 0; index < schoolclassesOfUser.length; index++) {
        const item = schoolclassesOfUser[index];
        const projectsOfSchoolclass = await getProjectsOfSchoolclass(item);
        temp.push(projectsOfSchoolclass);
    }
    return temp ?? null;
}

export const updateSchoolclassName = async (schoolclassId: string, name: string) => {
    const result = await httpService.postAsync<SchoolclassDto>(
        API_URL + `schoolclasses/${schoolclassId}`,
        { name: name },
        "PUT",
        true,
        true
    );
    return result ?? null;
}

export const deleteSchoolclass = async (schoolclassId: string) => {
    const result = await httpService.postAsync<string>(
        API_URL + `schoolclasses/${schoolclassId}`,
        {},
        "DELETE",
        true,
        true
    );
    return result ?? null;
}
