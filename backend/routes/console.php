<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('bills:check-due')->dailyAt('08:00')->withoutOverlapping();
