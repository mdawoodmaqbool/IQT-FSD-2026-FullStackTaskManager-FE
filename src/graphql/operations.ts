import { gql } from "@apollo/client";

export const GET_TASKS = gql`
  query GetTasks($status: TaskStatus, $limit: Int) {
    tasks(status: $status, limit: $limit) {
      id
      title
      description
      status
      createdAt
      updatedAt
    }
  }
`;

export const GET_TASK_COUNTS = gql`
  query GetTaskCounts {
    taskCounts {
      all
      pending
      in_progress
      completed
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $description: String) {
    createTask(title: $title, description: $description) {
      id
      title
      description
      status
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $title: String
    $description: String
    $status: TaskStatus
  ) {
    updateTask(
      id: $id
      title: $title
      description: $description
      status: $status
    ) {
      id
      title
      description
      status
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;
