name := """contest-server"""

version := "1"

lazy val root = (project in file(".")).enablePlugins(PlayJava)

scalaVersion := "2.12.6"
javacOptions ++= Seq("-source", "1.8")

crossScalaVersions := Seq("2.11.12", "2.12.4")

libraryDependencies += guice

libraryDependencies += "org.apache.commons" % "commons-text" % "1.4"
libraryDependencies += "com.amazonaws" % "aws-java-sdk" % "1.11.327"
libraryDependencies += "redis.clients" % "jedis" % "2.9.0"

// Test Database
libraryDependencies += "com.h2database" % "h2" % "1.4.197"
libraryDependencies += "commons-io" % "commons-io" % "2.6"

// Testing libraries for dealing with CompletionStage...
libraryDependencies += "org.assertj" % "assertj-core" % "3.6.2" % Test
libraryDependencies += "org.awaitility" % "awaitility" % "2.0.0" % Test

//libraryDependencies ++= Seq(evolutions, jdbc)

// Make verbose tests
testOptions in Test := Seq(Tests.Argument(TestFrameworks.JUnit, "-a", "-v"))
