from locust import HttpUser, task, between

class MyUser(HttpUser):
	wait_time = between(5, 15)

	@task
	def homepage(self)
		self.client.get("/")