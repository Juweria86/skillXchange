import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Session {
  _id: string;
  title: string;
  date: string; // ISO string
  startTime: string;
  endTime: string;
  skill: string;
  type: "learning" | "teaching";
  userId: string;
  createdAt: string;
}

interface TransformedSession {
  id: string;
  title: string;
  date: Date;
  time: string;
  skill: string;
  type: "learning" | "teaching";
}

interface SessionFormValues {
  id?: string;
  title: string;
  date: Date | string;
  time: string; // Format: "HH:MM AM/PM - HH:MM AM/PM"
  skill: string;
  type: "learning" | "teaching";
}

export const sessionApi = createApi({
  reducerPath: 'sessionApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api/sessions',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Session'],
  endpoints: (builder) => ({
    getSessions: builder.query<TransformedSession[], void>({
      query: () => '',
      providesTags: ['Session'],
      transformResponse: (response: Session[]) => {
        return response.map(session => ({
          id: session._id,
          title: session.title,
          date: new Date(session.date),
          time: `${session.startTime} - ${session.endTime}`,
          skill: session.skill,
          type: session.type
        }));
      }
    }),
    createSession: builder.mutation<Session, SessionFormValues>({
      query: (session) => {
        const [startTime, endTime] = session.time.split(' - ');
        return {
          url: '',
          method: 'POST',
          body: {
            title: session.title,
            date: session.date.toISOString(),
            startTime,
            endTime,
            skill: session.skill,
            type: session.type
          }
        };
      },
      invalidatesTags: ['Session']
    }),
    updateSession: builder.mutation<Session, { id: string } & SessionFormValues>({
      query: ({ id, ...session }) => {
        const [startTime, endTime] = session.time.split(' - ');
        return {
          url: `http://localhost:5000/api/sessions/${id}`,
          method: 'PUT',
          body: {
            title: session.title,
            date: session.date.toISOString(),
            startTime,
            endTime,
            skill: session.skill,
            type: session.type
          }
        };
      },
      invalidatesTags: ['Session']
    }),
    deleteSession: builder.mutation<void, string>({
      query: (id) => ({
        url: `http://localhost:5000/api/sessions/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Session']
    })
  })
});

export const { 
  useGetSessionsQuery, 
  useCreateSessionMutation, 
  useUpdateSessionMutation,
  useDeleteSessionMutation
} = sessionApi;