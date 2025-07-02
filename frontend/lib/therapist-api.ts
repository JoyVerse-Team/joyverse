// API service for therapist dashboard data
// This service communicates with the Node.js backend for therapist, student, session, and emotion data

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Therapist {
  id: string;
  name: string;
  email: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  totalSessions: number;
  averageTime: number;
  recentEmotions: string[];
  lastSession: string;
}

export interface GameSession {
  id: string;
  sessionNumber: number;
  gameTitle: string;
  studentName: string;
  timestamp: string;
  totalTime: number;
  difficulty: string;
  isActive: boolean;
  rounds: GameRound[];
}

export interface GameRound {
  roundNumber: number;
  word?: string;
  difficulty?: string;
  timeTakenSeconds?: number;
  finalEmotion?: string;
  emotions?: EmotionData[];
  words?: WordData[]; // For compatibility with existing UI
}

export interface EmotionData {
  id: string;
  timestamp: string;
  emotion: string;
  confidence: number;
  word?: string;
  timeTaken?: number;
}

export interface WordData {
  word: string;
  difficulty: string;
  emotion: string;
  timeSpent: string;
}

export interface WeeklyData {
  date: string;
  sessions: {
    id: string;
    studentId: string;
    game: string;
    duration: number;
  }[];
  totalTime: number;
  emotionSummary: { [emotion: string]: number };
}

export interface DashboardData {
  students: Student[];
  recentSessions: GameSession[];
  weeklyStats: WeeklyData[];
}

class TherapistApiService {
  
  // Get all students for a therapist
  async getStudents(therapistId: string): Promise<Student[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/therapist/students/${therapistId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch students: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch students');
      }

      return data.students;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  // Get all sessions for a specific student
  async getStudentSessions(studentId: string, therapistId?: string): Promise<GameSession[]> {
    try {
      const queryParam = therapistId ? `?therapistId=${therapistId}` : '';
      const response = await fetch(`${API_BASE_URL}/therapist/student/${studentId}/sessions${queryParam}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch student sessions: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch student sessions');
      }

      // Transform the data to match the expected UI format
      return data.sessions.map((session: any) => ({
        ...session,
        rounds: session.rounds.map((round: any) => ({
          ...round,
          // Transform round data to include words array for UI compatibility
          words: round.word ? [{
            word: round.word,
            difficulty: round.difficulty || 'Medium',
            emotion: round.finalEmotion || 'Neutral',
            timeSpent: round.timeTakenSeconds ? `${Math.round(round.timeTakenSeconds / 60)}` : '0'
          }] : []
        }))
      }));
    } catch (error) {
      console.error('Error fetching student sessions:', error);
      throw error;
    }
  }

  // Get detailed emotion data for a specific session
  async getSessionEmotions(sessionId: string, therapistId?: string): Promise<GameSession> {
    try {
      const queryParam = therapistId ? `?therapistId=${therapistId}` : '';
      const response = await fetch(`${API_BASE_URL}/therapist/session/${sessionId}/emotions${queryParam}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch session emotions: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch session emotions');
      }

      const session = data.session;
      
      // Transform the data to match the expected UI format
      return {
        id: session.id,
        sessionNumber: 1, // Will be set by calling function
        gameTitle: session.game === 'snake' ? 'Snake Word Game' : session.game,
        studentName: session.studentName,
        timestamp: session.startTime,
        totalTime: session.endTime && session.startTime 
          ? Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60))
          : 0,
        difficulty: session.difficulty,
        isActive: session.isActive,
        rounds: session.rounds.map((round: any) => ({
          roundNumber: round.roundNumber,
          word: round.word,
          difficulty: round.difficulty,
          timeTakenSeconds: round.timeTakenSeconds,
          finalEmotion: round.finalEmotion,
          emotions: round.emotions || [],
          // Transform for UI compatibility
          words: round.word ? [{
            word: round.word,
            difficulty: round.difficulty || 'Medium',
            emotion: round.finalEmotion || 'Neutral',
            timeSpent: round.timeTakenSeconds ? `${Math.round(round.timeTakenSeconds / 60)}` : '0'
          }] : []
        }))
      };
    } catch (error) {
      console.error('Error fetching session emotions:', error);
      throw error;
    }
  }

  // Get dashboard data for a therapist
  async getDashboardData(therapistId: string): Promise<DashboardData> {
    try {
      // Fetch students
      const students = await this.getStudents(therapistId);

      // Fetch dashboard summary
      const response = await fetch(`${API_BASE_URL}/therapist/dashboard/${therapistId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch dashboard data');
      }

      // Get recent sessions from all students
      const recentSessions: GameSession[] = [];
      for (const student of students.slice(0, 5)) { // Limit to prevent too many requests
        try {
          const studentSessions = await this.getStudentSessions(student.id, therapistId);
          recentSessions.push(...studentSessions.slice(0, 2)); // Get 2 most recent sessions per student
        } catch (error) {
          console.warn(`Failed to fetch sessions for student ${student.id}:`, error);
        }
      }

      // Sort recent sessions by timestamp
      recentSessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return {
        students,
        recentSessions: recentSessions.slice(0, 10), // Show last 10 sessions
        weeklyStats: data.summary.weeklyStats
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const therapistApiService = new TherapistApiService();

// Legacy export for compatibility with existing mock data service
export const localDataService = {
  getDashboardData: async (therapistId?: string): Promise<DashboardData> => {
    let tId = therapistId;
    
    // Get therapist from localStorage if not provided
    if (!tId) {
      const storedTherapist = localStorage.getItem("therapist");
      if (!storedTherapist) {
        throw new Error('No therapist found in localStorage');
      }
      const therapist = JSON.parse(storedTherapist);
      tId = therapist.id;
    }
    
    if (!tId) {
      throw new Error('Therapist ID is required');
    }
    
    return therapistApiService.getDashboardData(tId);
  },
  
  getStudentSessions: async (studentId: string, therapistId?: string): Promise<GameSession[]> => {
    let tId = therapistId;
    
    // Get therapist from localStorage if not provided
    if (!tId) {
      const storedTherapist = localStorage.getItem("therapist");
      if (storedTherapist) {
        const therapist = JSON.parse(storedTherapist);
        tId = therapist.id;
      }
    }
    
    return therapistApiService.getStudentSessions(studentId, tId);
  }
};

export { TherapistApiService };
export default therapistApiService;
