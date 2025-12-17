import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Users,
  CheckSquare,
  Target,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { meetings, tasks, projects } from '@/data/mockData';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Import avatars
import sarahChenAvatar from '@/assets/inbox/sarah-chen-email.png';
import michaelTorresAvatar from '@/assets/inbox/michael-torres.png';
import alexKimAvatar from '@/assets/inbox/alex-kim.png';
import emilyWatsonAvatar from '@/assets/inbox/emily-watson.png';

const attendeeAvatars: Record<string, string> = {
  'Sarah Chen': sarahChenAvatar,
  'Michael Torres': michaelTorresAvatar,
  'Alex Kim': alexKimAvatar,
  'Emily Watson': emilyWatsonAvatar,
};

type ViewMode = 'month' | 'week';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  type: 'meeting' | 'task' | 'milestone';
  color: string;
  attendees?: string[];
  duration?: string;
  project?: string;
}

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  // Combine all events
  const calendarEvents = useMemo<CalendarEvent[]>(() => {
    const events: CalendarEvent[] = [];

    // Add meetings
    meetings.forEach((meeting) => {
      events.push({
        id: `meeting-${meeting.id}`,
        title: meeting.title,
        date: new Date(meeting.date),
        type: 'meeting',
        color: 'bg-primary',
        attendees: meeting.attendees,
        duration: meeting.duration,
      });
    });

    // Add task due dates
    tasks.forEach((task) => {
      events.push({
        id: `task-${task.id}`,
        title: task.title,
        date: new Date(task.dueDate),
        type: 'task',
        color: task.priority === 'critical' ? 'bg-destructive' : task.priority === 'high' ? 'bg-warning' : 'bg-success',
        project: task.project,
      });
    });

    // Add project milestones
    projects.forEach((project) => {
      project.milestones.forEach((milestone) => {
        events.push({
          id: `milestone-${milestone.id}`,
          title: `${project.name}: ${milestone.name}`,
          date: new Date(milestone.endDate),
          type: 'milestone',
          color: milestone.status === 'completed' ? 'bg-success' : milestone.status === 'delayed' ? 'bg-destructive' : 'bg-muted-foreground',
          project: project.name,
        });
      });
    });

    return events;
  }, []);

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Get week days
  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Navigation
  const goToPrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
    }
  };

  const goToNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const days = viewMode === 'month' ? getDaysInMonth(currentDate) : getWeekDays(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleAddEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    toast({
      title: 'Event Created',
      description: `"${formData.get('title')}" has been added to your calendar.`,
    });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6 nexus-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Manage meetings, tasks, and milestones</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-secondary rounded-lg p-1">
            <button
              onClick={() => setViewMode('month')}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                viewMode === 'month'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                viewMode === 'week'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Week
            </button>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddEvent} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" placeholder="Event title" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" defaultValue="meeting">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                      <SelectItem value="milestone">Milestone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" name="time" type="time" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Event details..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Event</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="nexus-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              {currentDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </h2>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={goToPrevious}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={goToNext}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="bg-secondary/50 p-3 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => {
            const events = day ? getEventsForDate(day) : [];
            const dayIsToday = day && isToday(day);

            return (
              <div
                key={index}
                className={cn(
                  'bg-card min-h-[100px] p-2 transition-colors',
                  day && 'hover:bg-secondary/30 cursor-pointer',
                  !day && 'bg-secondary/10'
                )}
                onClick={() => day && setSelectedDate(day)}
              >
                {day && (
                  <>
                    <div
                      className={cn(
                        'w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1',
                        dayIsToday && 'bg-primary text-primary-foreground',
                        !dayIsToday && 'text-foreground'
                      )}
                    >
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {events.slice(0, 3).map((event) => (
                        <button
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                          }}
                          className={cn(
                            'w-full text-left text-[10px] px-1.5 py-0.5 rounded truncate text-white font-medium',
                            event.color
                          )}
                        >
                          {event.title}
                        </button>
                      ))}
                      {events.length > 3 && (
                        <p className="text-[10px] text-muted-foreground px-1">
                          +{events.length - 3} more
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary" />
          <span className="text-muted-foreground">Meetings</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-success" />
          <span className="text-muted-foreground">Tasks (Normal)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-warning" />
          <span className="text-muted-foreground">Tasks (High Priority)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-destructive" />
          <span className="text-muted-foreground">Critical / Delayed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-muted-foreground" />
          <span className="text-muted-foreground">Milestones</span>
        </div>
      </div>

      {/* Upcoming Events Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 nexus-card">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Today's Schedule
          </h3>
          <div className="space-y-3">
            {calendarEvents
              .filter((e) => isToday(new Date(e.date)))
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className={cn('w-1 h-12 rounded-full', event.color)} />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{event.title}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {event.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.duration}
                        </span>
                      )}
                      {event.attendees && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {event.attendees.length} attendees
                        </span>
                      )}
                      {event.type === 'task' && (
                        <span className="flex items-center gap-1">
                          <CheckSquare className="w-3 h-3" />
                          Task
                        </span>
                      )}
                      {event.type === 'milestone' && (
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          Milestone
                        </span>
                      )}
                    </div>
                  </div>
                  {event.attendees && (
                    <div className="flex -space-x-2">
                      {event.attendees.slice(0, 3).map((attendee, idx) => (
                        <Avatar key={idx} className="w-8 h-8 border-2 border-card">
                          <AvatarImage src={attendeeAvatars[attendee]} alt={attendee} />
                          <AvatarFallback className="bg-primary text-[10px] font-medium text-primary-foreground">
                            {attendee.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            {calendarEvents.filter((e) => isToday(new Date(e.date))).length === 0 && (
              <p className="text-muted-foreground text-center py-8">No events scheduled for today</p>
            )}
          </div>
        </div>

        <div className="nexus-card">
          <h3 className="font-semibold text-foreground mb-4">Upcoming This Week</h3>
          <div className="space-y-2">
            {calendarEvents
              .filter((e) => {
                const eventDate = new Date(e.date);
                const today = new Date();
                const weekFromNow = new Date();
                weekFromNow.setDate(today.getDate() + 7);
                return eventDate >= today && eventDate <= weekFromNow;
              })
              .slice(0, 8)
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className={cn('w-2 h-2 rounded-full', event.color)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Event Detail Dialog */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className={cn('w-3 h-3 rounded', selectedEvent.color)} />
                {selectedEvent.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-3 text-sm">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                <span>
                  {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              {selectedEvent.duration && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedEvent.duration}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <span
                  className={cn(
                    'px-2 py-1 rounded text-xs font-medium',
                    selectedEvent.type === 'meeting' && 'bg-primary/10 text-primary',
                    selectedEvent.type === 'task' && 'bg-success/10 text-success',
                    selectedEvent.type === 'milestone' && 'bg-muted text-muted-foreground'
                  )}
                >
                  {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                </span>
                {selectedEvent.project && (
                  <span className="text-muted-foreground">• {selectedEvent.project}</span>
                )}
              </div>
              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Attendees</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.attendees.map((attendee, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-secondary/50 rounded-full px-3 py-1">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={attendeeAvatars[attendee]} alt={attendee} />
                          <AvatarFallback className="text-[8px]">
                            {attendee.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{attendee}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                  Close
                </Button>
                <Button>Edit Event</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CalendarView;
