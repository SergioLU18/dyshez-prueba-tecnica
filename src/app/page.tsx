'use client'
import * as React from 'react';
import { logout, getUserData, getUserTasks, createUserTask, completeUserTask, deleteUserTask } from './actions';
import styles from './page.module.css'
import { PageContainer } from '@/components/pageContainer';
import { UserProfile, UserTask } from '@/types';
import LoadingDots from '@/components/loadingDots';
import { Toaster, toast } from 'sonner'

const Home: React.FC = () => {

  const [userProfile, setUserProfile] = React.useState<UserProfile>()
  const [tasks, setTasks] = React.useState<UserTask[]>([])
  const [modalOpen, setModalOpen] = React.useState(false);
  const modalContentRef = React.useRef<HTMLDivElement>(null)
  const [newTaskTitle, setNewTaskTitle] = React.useState("");
  const [newTaskDescription, setNewTaskDescription] = React.useState("")

  // Custom sort made to show the tasks by completion, date of creation, and date of completion
  const customTaskSort = (taskArray: UserTask[]) => {
    return taskArray.sort((a, b) => {
      if(!a.completed && !b.completed) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      else if(a.completed && b.completed) {
        return new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime();
      }
      return Number(a.completed) - Number(b.completed)
    })
  }

  const initializeUser = async () => {
    const profileData = await getUserData();
    setUserProfile(profileData)
  }

  const handleTaskTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(event.target.value)
  }

  const handleTaskDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTaskDescription(event.target.value)
  }

  const handleDeleteTask = async (task: UserTask) => {
    const error = await deleteUserTask(task);
    if(error) {
      toast.error(error.message)
    }
    else {
      // Task is also removed locally so we don't have to run an additional query
      const newTasks = [...tasks];
      const index = newTasks.indexOf(task);
      newTasks.splice(index, 1);
      setTasks(newTasks)
    }
  }

  const handleCompleteTask = async (task: UserTask) => {
    const error = await completeUserTask(task)

    if(error) {
      toast.error(error.message)
    }
    else {
      const newTasks = [...tasks];
      const index = newTasks.indexOf(task);
      newTasks.splice(index, 1);
      newTasks.push({
        ...task,
        completedAt: new Date(),
        completed: true
      })
      setTasks(newTasks)
    }
  }

  const handleCreateTask = async () => {
    if(!newTaskDescription || !newTaskTitle) return
    
    // New task is also created locally so that we can update our local tasks
    // without needing to query them
    const newTask = {
      id: null,
      createdAt: new Date(),
      title: newTaskTitle,
      description: newTaskDescription,
      completed: false,
      completedAt: null
    }
    
    const { data, error }= await createUserTask(newTask, userProfile?.userId)
    
    if(error || !data) {
      ("Something went wrong while creating your task. Please, try agains")
    }
    else {
      toast.success("Your task was created successfully!")
      newTask.id = data[0].id
      
      setTasks(customTaskSort([...tasks, newTask]))
      handleModalClose()
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setNewTaskTitle("");
    setNewTaskDescription("")
  }

  const initializeUserTasks = async () => {
    if(!userProfile) return
    const {processedTasks, error} = await getUserTasks(userProfile.userId)
    if(error) {
      toast.error("Something went wrong while obtaining your tasks. Please, refresh the page")
    }
    setTasks(customTaskSort(processedTasks))
  }

  React.useEffect(() => {
    initializeUserTasks()
  }, [userProfile])

  React.useEffect(() => {
    initializeUser()
  }, [])

  // Set listener for clicks outside of modal to automatically close it
  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (modalOpen && modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
        handleModalClose()
      }
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [modalOpen]);

  // Return loading if user is being loaded
  if(!userProfile) return (
    <div className={styles.loading}>
      <LoadingDots />
    </div>
  );

  return (
    <PageContainer flexDirection='column'>
          <div className={styles.header}>
              Welcome back, {userProfile.names}!
              <button className={`${styles.button} ${styles.new}`} onClick={() => {setModalOpen(true)}}>
                New Task
              </button>
          </div>
          <div className={styles.tasks}>
              {tasks.map((task, index) => (
                <div className={`${styles.task} ${task.completed ? styles["completed"] : ""}`} key={`task-${index}`}>
                  <div className={styles["task-title"]}>
                      {task.title}
                  </div>
                  {!task.completed && (
                    <>
                      <div className={styles["task-description"]}>
                        {task.description}
                      </div>
                      <div className={styles["task-details"]}>
                          {task.createdAt.toDateString()}
                          <div className={styles["task-actions"]}>
                            <button className={`${styles["task-button"]} ${styles.destructive}`} onClick={() => {handleDeleteTask(task)}}>
                              Delete
                            </button>
                            <button className={styles["task-button"]} onClick={() => {handleCompleteTask(task)}}>
                              Complete
                            </button>
                          </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
              <Toaster richColors/>
          </div>
          <button className={`${styles.button} ${styles.logout}`} onClick={logout}>
            Logout
          </button>

          {/* New Task Modal */}
          {modalOpen && (<div className={styles.modal}>
              <div className={styles["modal-content"]} ref={modalContentRef}>
                  <div className={styles["modal-header"]}>
                    Add new task
                  </div>
                  <input value={newTaskTitle} onChange={handleTaskTitleChange} className={styles.input} placeholder="Title of your task" />
                  <textarea value={newTaskDescription} onChange={handleTaskDescriptionChange} className={styles.input} placeholder="Description of your task" />
                  <div className={styles["modal-buttons"]}>
                    <button className={`${styles.button} ${styles.logout}`} onClick={handleModalClose}>
                      Cancel
                    </button>
                    <button className={`${styles.button} ${styles.new}`} onClick={handleCreateTask}>
                      Save task
                    </button>
                  </div>
              </div>
          </div>)}
    </PageContainer>
    )
}

export default Home;
