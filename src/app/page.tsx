'use client'
import { redirect } from 'next/navigation';
import * as React from 'react';
import { logout, getUserData, getUserTasks } from './actions';
import styles from './page.module.css'
import { PageContainer } from '@/components/pageContainer';
import { UserProfile, UserTask } from '@/types';

const Home: React.FC = () => {

  const [userProfile, setUserProfile] = React.useState<UserProfile>()
  const [tasks, setTasks] = React.useState<UserTask[]>([])

  const initializeUser = async () => {
    const profileData = await getUserData();
    setUserProfile(profileData)
  }

  const initializeUserTasks = async () => {
    if(!userProfile) return
    const {processedTasks, error} = await getUserTasks(userProfile.userId)
    if(error) {
      // TODO: Add logic to set error toast
    }
    setTasks(processedTasks)
  }

  React.useEffect(() => {
    initializeUserTasks()
  }, [userProfile])

  React.useEffect(() => {
    initializeUser()
  }, [])

  if(!userProfile) return;

  return (
    <PageContainer flexDirection='column'>
          <div className={styles.header}>
              Welcome back, {userProfile.names}!
              <button className={`${styles.button} ${styles.new}`} onClick={() => {console.log("Add new task")}}>
                New Task
              </button>
          </div>
          <div className={styles.tasks}>
              {tasks.map((task, index) => (
                <div className={styles.task} id={`task ${index}`}>
                  <div className={styles["task-title"]}>
                      {task.title}
                  </div>
                  <div className={styles["task-description"]}>
                      {task.description}
                  </div>
                  <div className={styles["task-details"]}>
                      {task.createdAt.toDateString()}
                  </div>
                </div>
              ))}
          </div>
          {/* <button className={`${styles.button} ${styles.logout}`} onClick={logout}>
            Logout
          </button> */}
    </PageContainer>
    )
}

export default Home;
