import sbt._
import Keys._

object Common {
  val settings: Seq[Setting[_]] = Seq(
    organization := "com.example",
    version := "1.2.3-SNAPSHOT"
  )


  val fooDependency = "com.foo" %% "foo" % "2.4"
}