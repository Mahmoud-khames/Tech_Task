type Task ={
    _id: string;
    title: string;
    description: string;
    status: string;
    assignedTo: [];
}

type User = {
    _id: string;
    username: string;
    email: string;
    role: string;
}
export type { Task , User};